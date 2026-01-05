import { ROUTES } from "@/constants/routes";
import { PRODUCT_TYPES } from "@/constants";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useViewEcommerceProductByIdQuery,
  useUpdateEcommerceProductMutation,
} from "@/redux/services/product";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import {
  PRODUCT_TYPE_OPTIONS,
  SUBSCRIPTION_PERIOD_OPTIONS,
  INTERVAL_OPTIONS,
  generateSubscriptionLengthOptions,
} from "@/constants/productOptions";

// Variation schema for SUBSCRIPTION_VARIABLE
const variationSchema = z.object({
  name: z.string().optional(),
  regularPrice: z.string().optional(),
  subscriptionPeriod: z.string().optional(),
  periodLength: z.string().optional(),
  subscriptionLength: z.string().optional(),
});

// Form schema for editing
const editProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  productType: z.string().optional(), // Read-only field, no validation needed
  regularPrice: z.string().optional(),
  imageUrl: z.string().optional(),
  subscriptionPeriod: z.string().optional(),
  subscriptionPeriodInterval: z.string().optional(),
  subscriptionLength: z.string().optional(),
  variations: z.array(variationSchema).optional(),
});

type EditProductFormValues = z.infer<typeof editProductSchema>;

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: productData,
    isLoading,
    error,
  } = useViewEcommerceProductByIdQuery(id!);
  const [updateEcommerceProduct, { isLoading: isUpdating }] =
    useUpdateEcommerceProductMutation();

  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      productType: "",
      regularPrice: "",
      imageUrl: "",
      subscriptionPeriod: "",
      subscriptionPeriodInterval: "",
      subscriptionLength: "",
      variations: [],
    },
  });

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  const selectedProductType = form.watch("productType");
  const subscriptionPeriod = form.watch("subscriptionPeriod");
  const subscriptionPeriodInterval = form.watch("subscriptionPeriodInterval");

  // Generate subscription length options based on current interval and period
  const subscriptionLengthOptions = generateSubscriptionLengthOptions(
    (subscriptionPeriodInterval as string) || "",
    (subscriptionPeriod as string) || ""
  );

  console.log("Product Data:", productData);
  // Update form when product data is loaded
  useEffect(() => {
    if (productData) {
      const formData: any = {
        name: productData.name || "",
        description: productData.description || "",
        sku: productData.sku || "",
        productType: productData.productType || "",
        regularPrice: productData.regularPrice?.toString() || "",
        imageUrl: productData.imageUrl || "",
        subscriptionPeriod: productData.subscriptionPeriod || "",
        subscriptionPeriodInterval: productData.subscriptionPeriodInterval?.toString() || "1",
        subscriptionLength: productData.subscriptionLength?.toString() || "",
        variations: [],
      };

      // Handle SUBSCRIPTION_FIXED fields
      // if (productData.productType === PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
      //   // For subscription fixed, get data from first variation if available
      //   if (productData.variations && productData.variations.length > 0) {
      //     const firstVariation = productData.variations[0];
      //     formData.subscriptionPeriod = firstVariation.subscriptionPeriod || "";
      //     formData.subscriptionPeriodInterval =
      //       firstVariation.subscriptionPeriodInterval?.toString() || "1";
      //     formData.regularPrice = firstVariation.regularPrice?.toString() || "";
      //   }
      // }

      // Handle SUBSCRIPTION_VARIABLE variations
      if (
        productData.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE &&
        productData.variations
      ) {
        formData.variations = productData.variations.map((variation: any) => ({
          name: variation.name || "",
          regularPrice: variation.regularPrice?.toString() || "",
          subscriptionPeriod: variation.subscriptionPeriod || "",
          periodLength: variation.subscriptionPeriodInterval?.toString() || "1",
          subscriptionLength: variation.subscriptionLength?.toString() || "",
        }));
      }

      form.reset(formData);
    }
  }, [productData, form]);

  const handleCancel = () => {
    navigate(ROUTES.PRODUCTS_PATH);
  };

  const handleUpdate = async (data: EditProductFormValues) => {
    try {
      const updatePayload: any = {
        name: data.name,
        description: data.description || "",
        sku: data.sku,
        productType: data.productType,
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
      };

      // Handle different product types
      if (data.productType === PRODUCT_TYPES.ONE_TIME) {
        if (data.regularPrice) {
          updatePayload.regularPrice = parseFloat(data.regularPrice);
        }
      }

      if (data.productType === PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
        if (data.regularPrice)
          updatePayload.regularPrice = parseFloat(data.regularPrice);
        if (data.subscriptionPeriod)
          updatePayload.subscriptionPeriod = data.subscriptionPeriod;
        if (data.subscriptionPeriodInterval)
          updatePayload.subscriptionPeriodInterval = parseInt(
            data.subscriptionPeriodInterval
          );
        if (data.subscriptionLength)
          updatePayload.subscriptionLength = parseInt(data.subscriptionLength);
      }

      if (
        data.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE &&
        data.variations
      ) {
        const transformedVariations = data.variations
          .filter((v: any) => v.name && v.regularPrice && v.subscriptionPeriod)
          .map((v: any) => ({
            name: v.name,
            regularPrice: parseFloat(v.regularPrice),
            subscriptionPeriod: v.subscriptionPeriod,
            subscriptionPeriodInterval: v.periodLength
              ? parseInt(v.periodLength)
              : 1,
            subscriptionLength: v.subscriptionLength
              ? parseInt(v.subscriptionLength)
              : 0,
          }));
        updatePayload.variations = transformedVariations;
      }

      await updateEcommerceProduct({
        id: id!,
        data: updatePayload,
      }).unwrap();

      toast.success("Product updated successfully!", {
        duration: 2000,
      });

      // Navigate back to products page after a delay
      //   setTimeout(() => {
      //     navigate(ROUTES.PRODUCTS_PATH);
      //   }, 1000);
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };
      const message =
        err?.data?.message || "Failed to update product. Please try again.";
      toast.error(message, {
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p >Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading product details</p>
          <Button
            onClick={() => navigate(ROUTES.PRODUCTS_PATH)}
            variant="outline"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ backgroundColor: "var(--lilac)" }} className="py-3 px-12">
        <Link
          to={ROUTES.PRODUCTS_PATH}
          className="font-normal text-sm text-muted-foreground"
        >
          {"<- Back to Products"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">Edit Product</h1>
      </div>

      <div
        className="mt-3 rounded-[15px] max-w-[815px] mx-auto p-6 bg-white"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Edit Product Details
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-6"
          >
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Paracetamol"
                      readOnly
                      className="w-full cursor-not-allowed"
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
                  <FormLabel className="text-sm font-medium">
                    Product Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Paracetamol is a medicine used to help ease mild to moderate pain and to lower high temperature."
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
                    <FormLabel className="text-sm font-medium">
                      SKU
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="PAR-500"
                        readOnly
                        className="w-full cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Type - Read Only */}
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Product Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          PRODUCT_TYPE_OPTIONS.find(
                            (opt) => opt.value === field.value
                          )?.label || field.value
                        }
                        readOnly
                        className="w-full cursor-not-allowed"
                        placeholder="Product type will be loaded..."
                      />
                    </FormControl>
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
                    <FormLabel className="text-sm font-medium">
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <FormField
                      control={form.control}
                      name="regularPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Subscription price ($) <span className="text-red-500">*</span>
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
                  </div>

                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name="subscriptionPeriodInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Interval <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Interval" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INTERVAL_OPTIONS.map((option) => (
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

                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name="subscriptionPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
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
                </div>

                <FormField
                  control={form.control}
                  name="subscriptionLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Stop renewing after
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subscriptionLengthOptions.map((option) => (
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
              </>
            )}

            {selectedProductType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">
                    Subscription Variations
                  </h3>
                </div>

                {/* <div className="flex justify-end mb-0">
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
                </div> */}

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg p-4 space-y-4 bg-[#FCF9FF]"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
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
                          <FormLabel className="text-sm font-medium">
                            Variation Name{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Metformin - 50mg"
                              className="w-full bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6">
                        <FormField
                          control={form.control}
                          name={`variations.${index}.regularPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Subscription price ($){" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="50"
                                  type="number"
                                  className="w-full bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>


                      <div className="md:col-span-3">

                        <FormField
                          control={form.control}
                          name={`variations.${index}.periodLength`}
                          render={({ field }) => (
                            <FormItem className="w-[48%]">
                              <FormLabel className="text-sm font-medium">
                                Interval{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select Interval" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {INTERVAL_OPTIONS.map((option) => (
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


                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`variations.${index}.subscriptionPeriod`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Subscription Period{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Month" />
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
                    </div>


                    <FormField
                      control={form.control}
                      name={`variations.${index}.subscriptionLength`}
                      render={({ field }) => {
                        const periodLength = form.watch(`variations.${index}.periodLength`);
                        const period = form.watch(`variations.${index}.subscriptionPeriod`);
                        const lengthOptions = generateSubscriptionLengthOptions((periodLength as string) || "", (period as string) || "");

                        return (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Stop renewing after
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Select Length" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {lengthOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Image URL Field */}
            {/* <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Image URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter image URL"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-full min-h-[44px] px-6 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="rounded-full min-h-[44px] px-6 text-sm font-medium text-white cursor-pointer"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditProductPage;
