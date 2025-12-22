import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createOrderSchema,
  type CreateOrderFormData,
} from "@/schemas/createOrderSchema";
import { useGetStatesQuery } from "@/redux/services/states";
import { useGetProjectsQuery } from "@/redux/services/projects";
import { useCreatePatientOrderMutation } from "@/redux/services/order";
import { useGetAllProductVariationsQuery } from "@/redux/services/productVariations";
import { X } from "lucide-react";
import type { PatientOrder, PatientDetail } from "@/types/responses/patient";
import ProductVariationSVG from "@/assets/icons/ProductVariation";

interface PatientOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: PatientOrder | null;
  patient: PatientDetail;
}

export function PatientOrderModal({
  isOpen,
  onClose,
  order,
  patient,
}: PatientOrderModalProps) {
  const isEditing = !!order;
  const [selectedProductVariations, setSelectedProductVariations] = useState<
    any[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      userAddress: "none",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      project: "",
      paymentMethod: "",
      productVariations: [],
    },
  });

  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery();
  const { data: projects = [], isLoading: isLoadingProjects } =
    useGetProjectsQuery();
  const [createPatientOrder, { isLoading: isCreatingOrder }] =
    useCreatePatientOrderMutation();
  const { data: productVariationsData, isLoading: isLoadingProducts } =
    useGetAllProductVariationsQuery({
      page: 1,
      limit: 500,
      q: "",
      withoutProducts: "",
    });

  const productVariations = productVariationsData?.productVariations || [];

  // Filter out already selected products from dropdown
  const availableProducts = productVariations.filter(
    (product) =>
      !selectedProductVariations.some(
        (selected) => selected.productVariation?.id === product.id
      )
  );

  const watchedUserAddress = form.watch("userAddress");

  // Auto-populate address fields when user selects an address
  useEffect(() => {
    if (
      watchedUserAddress &&
      watchedUserAddress !== "none" &&
      patient?.addresses
    ) {
      const selectedAddress = patient.addresses.find(
        (addr) => addr.id === watchedUserAddress
      );
      if (selectedAddress) {
        form.setValue("address1", selectedAddress.billing?.address1 || "");
        form.setValue("address2", selectedAddress.billing?.address2 || "");
        form.setValue("city", selectedAddress.billing?.city || "");
        form.setValue("state", selectedAddress.billing?.state?.id || "");
        form.setValue("zipcode", selectedAddress.billing?.zipcode || "");
      }
    } else if (watchedUserAddress === "none") {
      // Clear fields when "none" is selected
      form.setValue("address1", "");
      form.setValue("address2", "");
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("zipcode", "");
    }
  }, [watchedUserAddress, patient?.addresses, form]);

  useEffect(() => {
    if (isOpen && !isEditing) {
      form.reset({
        userAddress: "none",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipcode: "",
        project: "",
        paymentMethod: "",
        productVariations: [],
      });
      setSelectedProductVariations([]);
      setSelectedProductId("");
    }
  }, [isOpen, isEditing, form]);

  const handleProductSelect = (productId: string) => {
    if (!productId) {
      setSelectedProductId("");
      return;
    }

    const product = productVariations.find((pv) => pv.id === productId);
    if (!product) return;

    const newProductVariation = {
      id: crypto.randomUUID(),
      productVariation: product,
      quantity: 1,
      pricePerUnitOverride: product.pricePerUnit,
    };

    const updatedVariations = [
      ...selectedProductVariations,
      newProductVariation,
    ];
    setSelectedProductVariations(updatedVariations);
    form.setValue("productVariations", updatedVariations);
    setSelectedProductId("");
  };

  const handleRemoveProduct = (id: string) => {
    const updatedVariations = selectedProductVariations.filter(
      (pv) => pv.id !== id
    );
    setSelectedProductVariations(updatedVariations);
    form.setValue("productVariations", updatedVariations);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedVariations = selectedProductVariations.map((pv) =>
      pv.id === id ? { ...pv, quantity: Math.max(1, quantity) } : pv
    );
    setSelectedProductVariations(updatedVariations);
    form.setValue("productVariations", updatedVariations);
  };

  const onSubmit = async (data: CreateOrderFormData) => {
    try {
      // Get the selected payment method ID (paymentId)
      const selectedPaymentId =
        data.paymentMethod && data.paymentMethod.trim()
          ? data.paymentMethod
          : null;
      const orderData = {
        address: {
          billing: {
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
          },
          shipping: {
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
          },
        },
        patient: patient.id,
        project: data.project || undefined,
        productVariations: data.productVariations.map((pv) => ({
          productVariation: pv.productVariation?.id,
          quantity: pv.quantity,
        })),
        paymentMethod: selectedPaymentId,
        isAddressInSelect: data.userAddress !== "none",
      };
      await createPatientOrder(orderData).unwrap();
      toast.success("Order created successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  const handleClose = () => {
    form.reset({
      userAddress: "none",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      project: "",
      paymentMethod: "",
      productVariations: [],
    });
    setSelectedProductVariations([]);
    setSelectedProductId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-col border-b border-[#D9D9D9] p-4">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Order" : "Add Order"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Address and Project Info */}
                <div className="space-y-6">
                  {/* User Address Dropdown */}
                  {patient?.addresses && patient.addresses.length > 0 && (
                    <FormField
                      control={form.control}
                      name="userAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Use Address *</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose Address" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">
                                  None - Enter manually
                                </SelectItem>
                                {patient.addresses.map((address) => (
                                  <SelectItem
                                    key={address.id}
                                    value={address.id}
                                  >
                                    {address.billing?.address1},{" "}
                                    {address.billing?.city},{" "}
                                    {address.billing?.state?.abbreviation}{" "}
                                    {address.billing?.zipcode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Add New Address Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Add New Address</h3>

                    <div className="space-y-4">
                      {/* Address Line 1 and 2 */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 1 *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Eg. 1247 Broadway Street"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 2</FormLabel>
                              <FormControl>
                                <Input placeholder="Eg. Suite 302" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* City and State */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Eg. Los Angeles"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={isLoadingStates}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select State" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {states.map((state) => (
                                      <SelectItem
                                        key={state.id}
                                        value={state.id}
                                      >
                                        {state.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Zipcode and Country */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Zip Code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <div className="bg-gray-100 px-3 py-2 rounded-md text-gray-700">
                              United States
                            </div>
                          </FormControl>
                        </FormItem>
                      </div>
                    </div>
                  </div>

                  {/* Project Setup */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Setup</h3>
                    <FormField
                      control={form.control}
                      name="project"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project *</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoadingProjects}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Default Project" />
                              </SelectTrigger>
                              <SelectContent>
                                {projects.map((project) => (
                                  <SelectItem
                                    key={project.id}
                                    value={project.id}
                                  >
                                    {project.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Credit Card */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Credit Card</h3>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method *</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Payment Method" />
                              </SelectTrigger>
                              <SelectContent>
                                {patient?.payment &&
                                patient.payment.length > 0 ? (
                                  patient.payment.map((card: any) => (
                                    <SelectItem
                                      key={card.paymentId}
                                      value={card.paymentId}
                                    >
                                      {card.cardBrand} ****{card.last4} - Expire{" "}
                                      {card.expMonth}/{card.expYear}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>
                                    No payment methods available
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Right Column - Products */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="productVariations"
                    render={() => (
                      <FormItem>
                        <FormLabel>Add Products *</FormLabel>
                        <FormControl>
                          <Select
                            value={selectedProductId}
                            onValueChange={handleProductSelect}
                            disabled={isLoadingProducts}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose product" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableProducts.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.product?.title} - {product.strength}{" "}
                                  ({product.form})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selected Products Table */}
                  {selectedProductVariations.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex gap-4 text-sm font-medium text-gray-700">
                          <div className="flex-[3]">Items</div>
                          <div className="flex-[1.5]">Price</div>
                          <div className="flex-1">Qty</div>
                          <div className="flex-[0.5]"></div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {selectedProductVariations.map((item) => (
                          <div key={item.id} className="px-4 py-3">
                            <div className="flex gap-4 items-center">
                              <div className="flex-[3]">
                                <div className="flex items-center gap-2">
                                  <ProductVariationSVG />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {item.productVariation?.product?.title} -{" "}
                                      {item.productVariation?.strength}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {item.productVariation?.form}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-[1.5]">
                                <div className="text-sm font-medium text-gray-900">
                                  ${item.productVariation?.pricePerUnit || 0}.00{" "}
                                  <span className="text-gray-500">x</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-12 h-8 text-sm"
                                />
                              </div>
                              <div className="flex-[0.5]">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveProduct(item.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isCreatingOrder}
                  className="px-5 py-1.25 min-h-10 cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="px-5 py-1.25 min-h-10 cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-4"
                >
                  {isCreatingOrder ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
