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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  createLabOrderSchema,
  type CreateLabOrderFormData,
} from "@/schemas/createLabOrderSchema";
import { useGetStatesQuery } from "@/redux/services/states";
import {
  useCreatePatientLabOrderMutation,
  useGetAllLabsQuery,
  useGetLabPanelsQuery,
  type LabInfo,
  type LabPanel,
} from "@/redux/services/labOrder";
import { useGetAllProductVariationsQuery } from "@/redux/services/productVariations";
import { X } from "lucide-react";
import type {
  EncounterDetail,
  EncounterLabOrder,
} from "@/types/responses/encounter";
import ProductVariationSVG from "@/assets/icons/ProductVariation";
import { encounterApi } from "@/redux/services/encounter";

interface EncounterLabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: EncounterLabOrder | null;
  encounter: EncounterDetail;
}

export function EncounterLabOrderModal({
  isOpen,
  onClose,
  order,
  encounter,
}: EncounterLabOrderModalProps) {
  const dispatch = useDispatch();
  const isEditing = !!order;
  const [selectedLabPanels, setSelectedLabPanels] = useState<string[]>([]);
  const [selectedProductVariations, setSelectedProductVariations] = useState<
    any[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedLabId, setSelectedLabId] = useState<string>("");

  const form = useForm<CreateLabOrderFormData>({
    resolver: zodResolver(createLabOrderSchema),
    defaultValues: {
      userAddress: "none",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      lab: "",
      labPanels: [],
      project: "",
      createPostResults: false,
      productVariations: [],
    },
  });

  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery();
  const [createPatientLabOrder, { isLoading: isCreatingLabOrder }] =
    useCreatePatientLabOrderMutation();
  const { data: labsData, isLoading: isLoadingLabs } = useGetAllLabsQuery();
  const { data: labPanelsData, isLoading: isLoadingLabPanels } =
    useGetLabPanelsQuery(selectedLabId, { skip: !selectedLabId });
  const { data: productVariationsData, isLoading: isLoadingProducts } =
    useGetAllProductVariationsQuery({
      page: 1,
      limit: 500,
      q: "",
      withoutProducts: "",
    });
  const labs = labsData || [];
  const labPanels = labPanelsData || [];
  const productVariations = productVariationsData?.productVariations || [];

  // Filter out already selected products from dropdown
  const availableProducts = productVariations.filter(
    (product) =>
      !selectedProductVariations.some(
        (selected) => selected.productVariation?.id === product.id
      )
  );
  const watchedUserAddress = form.watch("userAddress");
  const createPostResults = form.watch("createPostResults");

  // Auto-populate address fields when user selects an address
  useEffect(() => {
    if (
      watchedUserAddress &&
      watchedUserAddress !== "none" &&
      encounter?.patient?.addresses
    ) {
      const selectedAddress = encounter.patient.addresses.find(
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
      form.setValue("address1", "");
      form.setValue("address2", "");
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("zipcode", "");
    }
  }, [watchedUserAddress, encounter?.patient?.addresses, form]);

  useEffect(() => {
    if (isOpen && !isEditing) {
      form.reset({
        userAddress: "none",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipcode: "",
        lab: "",
        labPanels: [],
        project: "",
        createPostResults: false,
        productVariations: [],
      });
      setSelectedLabPanels([]);
      setSelectedProductVariations([]);
      setSelectedProductId("");
      setSelectedLabId("");
    }
  }, [isOpen, isEditing, form]);

  const handleLabSelect = (labId: string) => {
    setSelectedLabId(labId);
    form.setValue("lab", labId);
    form.setValue("labPanels", []);
    setSelectedLabPanels([]);
  };

  const handleLabPanelSelect = (panelId: string) => {
    const updatedPanels = selectedLabPanels.includes(panelId)
      ? selectedLabPanels.filter((id) => id !== panelId)
      : [...selectedLabPanels, panelId];

    setSelectedLabPanels(updatedPanels);
    form.setValue("labPanels", updatedPanels);
  };

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

  const onSubmit = async (data: CreateLabOrderFormData) => {
    try {
      const labOrderData = {
        patient: encounter.patient.id,
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
        affiliate: encounter.patient.affiliates?.[0],
        lab: data.lab,
        labPanels: data.labPanels || [],
        labTests: [],
        immediateProcessing: true,
        createOrderAfterResults: data.createPostResults || false,
        afterResultsOrderProductVariations: data.createPostResults
          ? (data.productVariations || []).map((pv) => ({
              productVariation: pv.productVariation?.id || "",
              quantity: pv.quantity,
            }))
          : [],
        order: encounter.id,
        isAddressInSelect: data.userAddress !== "none",
      };

      const response = await createPatientLabOrder(labOrderData).unwrap();
      
      // Update the encounter cache with the new lab order
      const updateAction = encounterApi.util.updateQueryData('viewEncounterById', encounter.id, (draft: any) => {
        if (!draft.siblingLabOrders) {
          draft.siblingLabOrders = [];
        }
        // Handle both response.data and direct response structure
        const labOrderData = response?.data || response;
        
        // Add the new lab order to the sibling lab orders with all required fields
        const newLabOrder = {
          id: labOrderData?.id || "",
          labOrderNumber: labOrderData?.labOrderNumber || "",
          encounter: labOrderData?.encounter || encounter.id,
          status: labOrderData?.status || "pending",
          lab: labOrderData?.lab || "",
          labTests: labOrderData?.labTests || [],
          labPanels: labOrderData?.labPanels || labOrderData.labPanels || [],
          dispatchStrategy: labOrderData?.dispatchStrategy || "",
          createdAt: labOrderData?.createdAt || new Date().toISOString(),
          updatedAt: labOrderData?.updatedAt || new Date().toISOString(),
        };
        draft.siblingLabOrders.push(newLabOrder);
      });
      
      (dispatch as any)(updateAction);
      
      toast.success("Lab order created successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create lab order");
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
      lab: "",
      labPanels: [],
      project: "",
      createPostResults: false,
      productVariations: [],
    });
    setSelectedLabPanels([]);
    setSelectedProductVariations([]);
    setSelectedProductId("");
    setSelectedLabId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-col border-b border-[#D9D9D9] p-4">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Lab Order" : "Add Lab Order"}
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
                  {encounter?.patient?.addresses &&
                    encounter.patient.addresses.length > 0 && (
                      <FormField
                        control={form.control}
                        name="userAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Use Address</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Address" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    Enter New Address
                                  </SelectItem>
                                  {encounter.patient.addresses.map(
                                    (address) => (
                                      <SelectItem
                                        key={address.id}
                                        value={address.id}
                                      >
                                        {address.billing?.address1},{" "}
                                        {address.billing?.city}
                                      </SelectItem>
                                    )
                                  )}
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
                                        <span className="block max-w-[200px] truncate">
                                          {state.name}
                                        </span>
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
                </div>

                {/* Right Column - Lab and Lab Panels */}
                <div className="space-y-6">
                  {/* Lab Selection */}
                  <FormField
                    control={form.control}
                    name="lab"
                    render={() => (
                      <FormItem>
                        <FormLabel>Select Lab *</FormLabel>
                        <FormControl>
                          <Select
                            value={selectedLabId}
                            onValueChange={handleLabSelect}
                            disabled={isLoadingLabs}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose Lab" />
                            </SelectTrigger>
                            <SelectContent>
                              {labs.map((lab: LabInfo) => (
                                <SelectItem key={lab.id} value={lab.id}>
                                  {lab.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lab Panels Selection */}
                  {selectedLabId && (
                    <FormField
                      control={form.control}
                      name="labPanels"
                      render={() => (
                        <FormItem>
                          <FormLabel>Lab Panels</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(panelId) =>
                                handleLabPanelSelect(panelId)
                              }
                              disabled={isLoadingLabPanels}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Lab Panels" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingLabPanels ? (
                                  <div className="p-2 text-sm text-gray-500">
                                    Loading panels...
                                  </div>
                                ) : labPanels.length > 0 ? (
                                  labPanels.map((panel: LabPanel) => (
                                    <SelectItem key={panel.id} value={panel.id}>
                                      {panel.title}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    No panels available
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Selected Lab Panels */}
                   {selectedLabPanels.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Selected Panels
                      </h4>
                      <div className="space-y-2">
                        {selectedLabPanels.map((panelId) => {
                          const panel = labPanels.find((p) => p.id === panelId);
                          return (
                            <div
                              key={panelId}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded"
                            >
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {panel?.title}
                                </div>
                                {panel?.description && (
                                  <div className="text-xs text-gray-500">
                                    {panel.description}
                                  </div>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLabPanelSelect(panelId)}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Create Post-Results Order Switch */}
                  <FormField
                    control={form.control}
                    name="createPostResults"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <FormLabel className="mb-0">
                          Create Post-Results Order
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Add Products - Only show if createPostResults is enabled */}
                  {createPostResults && (
                    <>
                      <FormField
                        control={form.control}
                        name="productVariations"
                        render={() => (
                          <FormItem>
                            <FormLabel>Add Products</FormLabel>
                            <FormControl>
                              <Select
                                value={selectedProductId}
                                onValueChange={handleProductSelect}
                                disabled={isLoadingProducts}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableProducts.map((product) => (
                                    <SelectItem
                                      key={product.id}
                                      value={product.id}
                                    >
                                      {product.product?.title} -{" "}
                                      {product.strength} ({product.form})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Selected Products */}
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
                                          {
                                            item.productVariation?.product
                                              ?.title
                                          }{" "}
                                          - {item.productVariation?.strength}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {item.productVariation?.form}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-[1.5]">
                                    <div className="text-sm font-medium text-gray-900">
                                      $
                                      {item.productVariation?.pricePerUnit || 0}
                                      .00{" "}
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
                                      onClick={() =>
                                        handleRemoveProduct(item.id)
                                      }
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
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isCreatingLabOrder}
                  className="px-5 py-1.25 min-h-10 cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingLabOrder}
                  className="px-5 py-1.25 min-h-10 cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-4"
                >
                  {isCreatingLabOrder ? "Creating..." : "Create Lab Order"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
