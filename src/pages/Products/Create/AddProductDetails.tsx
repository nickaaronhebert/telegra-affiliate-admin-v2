import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { PRODUCT_TYPES } from "@/constants";
import { cn } from "@/lib/utils";

// Constants
export const PRODUCT_TYPE_OPTIONS = [
  { label: "One Time", value: PRODUCT_TYPES.ONE_TIME },
  { label: "Subscription Fixed", value: PRODUCT_TYPES.SUBSCRIPTION_FIXED },
  {
    label: "Subscription Variable",
    value: PRODUCT_TYPES.SUBSCRIPTION_VARIABLE,
  },
];

export const SUBSCRIPTION_PERIOD_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

// Variation schema for SUBSCRIPTION_VARIABLE
const variationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  regularPrice: z.string().min(1, "Price is required"),
  subscriptionPeriod: z.string().default("month"),
  periodLength: z.string().default("1"),
  subscriptionLength: z.string().default("0"),
});

// Dynamic form schema based on product type
const createAddProductSchema = (productType: string) => {
  const baseSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    sku: z.string().min(1, "SKU is required"),
    productType: z.string().min(1, "Product type is required"),
  });

  if (productType === PRODUCT_TYPES.ONE_TIME) {
    return baseSchema.extend({
      regularPrice: z.string().min(1, "Regular price is required"),
      subscriptionPeriod: z.string().optional(),
      subscriptionPeriodInterval: z.string().optional(),
      subscriptionLength: z.string().optional(),
      variations: z.array(variationSchema).optional(),
    });
  }

  if (productType === PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
    return baseSchema.extend({
      regularPrice: z.string().min(1, "Regular price is required"),
      subscriptionPeriod: z.string().min(1, "Subscription period is required"),
      subscriptionPeriodInterval: z
        .string()
        .min(1, "Period interval is required"),
      subscriptionLength: z.string().optional(),
      variations: z.array(variationSchema).optional(),
    });
  }

  if (productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
    return baseSchema.extend({
      regularPrice: z.string().optional(),
      subscriptionPeriod: z.string().optional(),
      subscriptionPeriodInterval: z.string().optional(),
      subscriptionLength: z.string().optional(),
      variations: z.array(variationSchema).refine(
        (variations) => {
          // Must have at least one complete variation
          const completeVariations = variations.filter(
            (v) =>
              v.name && v.regularPrice && v.subscriptionPeriod && v.periodLength
          );
          return completeVariations.length > 0;
        },
        {
          message: "At least one complete variation is required",
        }
      ),
    });
  }

  // Default schema when no product type is selected
  return baseSchema.extend({
    regularPrice: z.string().optional(),
    subscriptionPeriod: z.string().optional(),
    subscriptionPeriodInterval: z.string().optional(),
    subscriptionLength: z.string().optional(),
    variations: z.array(variationSchema).optional(),
  });
};

// Default schema for initial form setup
const addProductSchema = createAddProductSchema("");

type AddProductFormValues = z.infer<typeof addProductSchema>;

interface AddProductDetailsProps {
  onCancel: () => void;
  onContinue: (data: AddProductFormValues) => void;
  isSubmitting?: boolean;
  initialData?: AddProductFormValues | null;
  isEditMode?: boolean;
}

const AddProductDetails = ({
  onCancel,
  onContinue,
  isSubmitting = false,
  initialData = null,
  isEditMode = false,
}: AddProductDetailsProps) => {
  const [currentSchema, setCurrentSchema] = useState(addProductSchema);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onSubmit", // Only validate after field is touched and loses focus
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      productType: "",
      regularPrice: "",
      subscriptionPeriod: "",
      subscriptionPeriodInterval: "",
      subscriptionLength: "",
      variations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  const {
    watch,
  } = form;

  const selectedProductType = watch("productType");

  // Initialize form with initial data when in edit mode
  useEffect(() => {
    if (initialData && !isInitialized) {
      // Reset form with initial data
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        sku: initialData.sku || "",
        productType: initialData.productType || "",
        regularPrice: initialData.regularPrice || "",
        subscriptionPeriod: initialData.subscriptionPeriod || "",
        subscriptionPeriodInterval: initialData.subscriptionPeriodInterval || "",
        subscriptionLength: initialData.subscriptionLength || "",
        variations: initialData.variations || [],
      });
      
      // Update schema based on product type
      if (initialData.productType) {
        const newSchema = createAddProductSchema(initialData.productType);
        setCurrentSchema(newSchema);
      }
      
      setIsInitialized(true);
    }
  }, [initialData, form, isInitialized]);

  // Update form validation schema when product type changes
  useEffect(() => {
    if (selectedProductType) {
      // Update schema based on product type
      const newSchema = createAddProductSchema(selectedProductType);
      setCurrentSchema(newSchema);

      // Skip auto-reset logic if in edit mode and already initialized
      if (isEditMode && isInitialized) {
        return;
      }

      // Reset variations when switching away from SUBSCRIPTION_VARIABLE
      if (selectedProductType !== PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
        form.setValue("variations", [], { shouldValidate: true });
      } else if (
        selectedProductType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE &&
        fields.length === 0
      ) {
        // Add default variation for SUBSCRIPTION_VARIABLE
        append({
          name: "",
          regularPrice: "",
          subscriptionPeriod: "",
          periodLength: "1",
          subscriptionLength: "0",
        });
      }
      if (selectedProductType === PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
        form.setValue("subscriptionPeriodInterval", "1");
        form.setValue("subscriptionLength", "0");
      }

      // ⭐ CLEAR FIXED FIELDS WHEN SWITCHING AWAY
      if (selectedProductType !== PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
        form.setValue("subscriptionPeriod", "");
        form.setValue("subscriptionPeriodInterval", "");
        form.setValue("subscriptionLength", "");
      }

      // Trigger validation after product type change
      // setTimeout(() => {
      //   form.trigger();
      // }, 0);
    }
  }, [selectedProductType, form, append, fields.length, isEditMode, isInitialized]);



  const addVariation = () => {
    append({
      name: "",
      regularPrice: "",
      subscriptionPeriod: "month",
      periodLength: "1",
      subscriptionLength: "0",
    });
  };

  const onSubmit = (data: AddProductFormValues) => {
    onContinue(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditMode ? "Edit Product Details" : "Add Product Details"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Metformin"
                    className={cn("w-full", isEditMode && "bg-gray-100 cursor-not-allowed")}
                    readOnly={isEditMode}
                    disabled={isEditMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Product Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Metformin is used to treat high blood sugar levels that are caused by a type of diabetes mellitus or sugar diabetes called type 2 diabetes."
                    className="w-full min-h-[100px] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SKU and Product Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    SKU <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="MET-50"
                      className={cn("w-full", isEditMode && "bg-gray-100 cursor-not-allowed")}
                      readOnly={isEditMode}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Type */}
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Product Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger className={cn("w-full", isEditMode && "bg-gray-100 cursor-not-allowed")}>
                        <SelectValue placeholder="Select Product Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dynamic Fields Based on Product Type */}
          {selectedProductType === PRODUCT_TYPES.ONE_TIME && (
            <FormField
              control={form.control}
              name="regularPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Regular Price <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="50"
                      type="number"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedProductType === PRODUCT_TYPES.SUBSCRIPTION_FIXED && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Regular Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="50"
                          type="number"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Subscription Period{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUBSCRIPTION_PERIOD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionPeriodInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Period Interval <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1"
                          type="number"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Subscription Length
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0"
                          type="number"
                          className="w-full"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        0 means unlimited
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {selectedProductType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">
                  Subscription Variations
                </h3>
              </div>

              <div className="flex justify-end mb-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addVariation}
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: "var(--primary)" }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product Variation
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className=" rounded-lg p-4 space-y-4 bg-[#FCF9FF]"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Variation {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        Delete
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`variations.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Variation Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Metformin - 50mg"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`variations.${index}.regularPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Regular Price{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="50"
                              type="number"
                              className="w-full"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.subscriptionPeriod`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Subscription Period{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            required
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SUBSCRIPTION_PERIOD_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-start justify-between">
                    <FormField
                      control={form.control}
                      name={`variations.${index}.periodLength`}
                      render={({ field }) => (
                        <FormItem className="w-[48%]">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Period Length{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="1"
                              type="number"
                              min="1"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.subscriptionLength`}
                      render={({ field }) => (
                        <FormItem className="w-[48%]">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Subscription Length
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="0"
                              type="number"
                              className="w-full"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            0 means unlimited
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-full min-h-[44px] px-6 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              // disabled={!isFormValid() || isSubmitting}
              className="rounded-full min-h-[44px] px-6 text-sm font-medium text-white cursor-pointer"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating Product..."
                  : "Creating Product..."
                : "Continue to Mapping"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddProductDetails;
