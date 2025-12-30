import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import InputElement from "@/components/Form/InputElement";
import { Trash } from "lucide-react";
import { Pill } from "lucide-react";
import {
  useGetAvailablePaymentMethodsQuery,
  useViewPatientByIdQuery,
} from "@/redux/services/patient";
import { useGetProductVariationsListQuery } from "@/redux/services/productVariationsList";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { updateEncounterOrder } from "@/schemas/updateEncounterOrder";
import { Form } from "@/components/ui/form";
import SelectElement from "@/components/Form/SelectElement";
import { useViewAllStatesQuery } from "@/redux/services/state";
import {
  AddressDropdown,
  type AddressOption,
} from "@/components/DropDown/AddressDropdown";
import type { EncounterAddress } from "@/types/responses/encounter";

import { Dropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import {
  useUpdateEncounterOrderMutation,
  useUpdateEncounterProductsMutation,
} from "@/redux/services/encounter";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface EditOrderProps {
  defaultPaymentMethodId?: string;
  patientId: string;
  encounterId: string;
  projectId: string;
  address: EncounterAddress;
  existingProducts: any;
}

interface UpdateEncounterOrderProps {
  defaultPaymentMethodId?: string;
  projectId: string;
  encounterId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultAddress: EncounterAddress;
  cardsData: {
    label: string;
    value: string;
  }[];

  address: AddressOption[];

  statesData: {
    label: string;
    value: string;
  }[];

  existingProducts: {
    productVariation: string;
    name: string;
    quantity: number;
  }[];
}

function UpdateEncounterOrder({
  open,
  address,
  defaultAddress,
  statesData,
  existingProducts,
  projectId,
  encounterId,
  cardsData,
  defaultPaymentMethodId,
  setOpen,
}: UpdateEncounterOrderProps) {
  const [updateEncounterOrderV2, { isLoading }] =
    useUpdateEncounterOrderMutation();

  const [updateEncounterProduct, { isLoading: isUpdatingProducts }] =
    useUpdateEncounterProductsMutation();
  const [currentProducts, setCurrentProducts] = useState(existingProducts);

  const {
    data: productVariations,
    isLoading: isProductVariationLoading,
    isFetching: isProductVariationFetching,
  } = useGetProductVariationsListQuery(
    {
      page: 1,
      limit: 500,
      q: "",
      withoutProducts: currentProducts
        ?.map((item: any) => {
          return item?.productVariation;
        })
        ?.join(","),
    },
    {
      skip: !open,
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        data: data?.productVariations?.map((item) => {
          const title = item?.product?.title ?? "";
          const form = item?.form ?? "";
          const strength = item?.strength ?? "";

          return {
            label: [title, strength, form].filter(Boolean).join(","),
            value: item?.id,
          };
        }),
        isLoading,
        isFetching,
      }),
    }
  );

  const form = useForm<z.infer<typeof updateEncounterOrder>>({
    mode: "onTouched",
    resolver: zodResolver(updateEncounterOrder),
    defaultValues: {
      address1: defaultAddress ? defaultAddress?.billing?.address1 : "",
      address2: defaultAddress ? defaultAddress?.billing?.address2 : undefined,
      city: defaultAddress ? defaultAddress?.billing?.city : "",
      state: defaultAddress ? defaultAddress?.billing?.state?.id : "",
      zipcode: defaultAddress ? defaultAddress?.billing?.zipcode : "",
      paymentCard: defaultPaymentMethodId,
    },
  });

  async function onSubmit(values: z.infer<typeof updateEncounterOrder>) {
    const productChanges = [];
    const oldProducts = new Map();
    const newProducts = new Map();

    for (const item of existingProducts) {
      oldProducts.set(item.productVariation, item.quantity);
    }

    for (const item of currentProducts) {
      newProducts.set(item.productVariation, item.quantity);
    }

    //to calculate newly added products
    for (const [key, value] of newProducts) {
      if (!oldProducts.has(key)) {
        productChanges.push({
          action: "add",
          productVariation: key as string,
          quantity: value as number,
        });
      }
    }

    //to calculate removed products and quantity updates
    for (const [key, value] of oldProducts) {
      if (!newProducts.has(key)) {
        productChanges.push({
          action: "remove",
          productVariation: key as string,
        });
      } else if (newProducts.get(key) !== value) {
        productChanges.push({
          action: "updateQuantity",
          productVariation: key as string,
          quantity: newProducts.get(key) as number,
        });
      }
    }

    try {
      await updateEncounterOrderV2({
        address: {
          billing: {
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            state: values.state,
            zipcode: values.zipcode,
          },
          shipping: {
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            state: values.state,
            zipcode: values.zipcode,
          },
        },
        id: encounterId,
        project: projectId,
        paymentMethod: values.paymentCard,
      }).unwrap();

      if (productChanges.length > 0) {
        await updateEncounterProduct({
          id: encounterId,
          productVariations: productChanges,
        }).unwrap();
      }

      toast.success("Encounter order updated successfully");
      setOpen(false);
    } catch (err: any) {
      console.log("error", err);
      toast.error(
        err?.data?.error || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" max-h-150 overflow-y-auto"
      >
        <div className="flex gap-2">
          <div className="mt-3.5  max-w-100 min-w-100">
            <div className="mb-4">
              <p className="text-sm font-semibold">Use address</p>
              <AddressDropdown
                options={address}
                onChange={(option: AddressOption) => {
                  console.log("option", option);
                  if (option.address1) {
                    form.setValue("address1", option.address1);
                  }
                  if (option.address2) {
                    form.setValue("address2", option.address2);
                  }
                  if (option.city) {
                    form.setValue("city", option.city);
                  }
                  if (option.state && option.state.id) {
                    form.setValue("state", option.state.id);
                  }
                  if (option.zipcode) {
                    form.setValue("zipcode", option.zipcode);
                  }
                }}
                placeholder="Choose Address"
              />
            </div>

            <div className="flex gap-1 my-1">
              <InputElement
                name={`address1`}
                className="w-48.75"
                label="Address Line 1"
                isRequired={true}
                messageClassName="text-right"
                //   placeholder="1247 Broadway Street"
                inputClassName="border-border min-h-[46px] placeholder:text-[#C3C1C6]"
                reserveSpace={true}
              />

              <InputElement
                name={`address2`}
                className="w-48.75"
                label="Address Line 2"
                isRequired={true}
                messageClassName="text-right"
                //   placeholder="1247 Broadway Street"
                inputClassName="border-border min-h-[46px] placeholder:text-[#C3C1C6]"
                reserveSpace={true}
              />
            </div>

            <div className="flex gap-1 my-1">
              <InputElement
                name={`city`}
                className="w-48.75"
                label="City"
                isRequired={true}
                messageClassName="text-right"
                //   placeholder="1247 Broadway Street"
                inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                reserveSpace={true}
              />
              <InputElement
                name={`zipcode`}
                className="w-48.75"
                label="Zipcode"
                isRequired={true}
                messageClassName="text-right"
                //   placeholder="1247 Broadway Street"
                inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                reserveSpace={true}
              />
            </div>
            <SelectElement
              name={"state"}
              options={statesData || []}
              label="State"
              isRequired={true}
              errorClassName="text-right"
              className="w-full border-border placeholder:text-[#C3C1C6]"
              reserveSpace={true}
            />

            <SelectElement
              name={"paymentCard"}
              options={cardsData || []}
              label="Credit Card"
              isRequired={false}
              errorClassName="text-right "
              //   placeholder="1247 Broadway Street"
              className="w-full border-border placeholder:text-[#C3C1C6]"
              reserveSpace={true}
            />
          </div>

          <div className="w-[48%]">
            <div>
              <p className="text-sm font-semibold mt-3.5">Add Products</p>
              <Dropdown
                loading={
                  isProductVariationLoading || isProductVariationFetching
                }
                options={productVariations || []}
                placeholder="Select Product"
                onChange={(option) => {
                  setCurrentProducts((prev) => [
                    ...prev,
                    {
                      productVariation: option.value,
                      name: option.label,
                      quantity: 1,
                    },
                  ]);
                }}
                optionClass="max-h-[200px] overflow-y-auto p-1"
              />
            </div>

            <div className="mt-4">
              {currentProducts.map((item, index) => (
                <div
                  key={item.productVariation}
                  className="flex justify-between items-center    p-2 bg-secondary"
                >
                  <div className="flex justify-between items-center w-87.5 p-2 ">
                    <div className="flex gap-1 items-center">
                      <Pill size={14} stroke="blue" />
                      <p className="text-sm font-semibold underline underline-offset-2">
                        {item.name}
                      </p>
                    </div>
                    <Trash
                      size={14}
                      className="cursor-pointer"
                      stroke="red"
                      onClick={() => {
                        setCurrentProducts((prev) => {
                          const filtered = prev.filter(
                            (item) =>
                              item.productVariation !==
                              currentProducts[index].productVariation
                          );
                          return filtered;
                        });
                      }}
                    />
                  </div>
                  <Input
                    className="max-w-20 border border-primary"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      const quantity = Number(e.target.value);
                      setCurrentProducts((prev) => {
                        const updated = [...prev];
                        updated[index].quantity = quantity;
                        return updated;
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2 border-t border-card-border pt-2">
          <Button
            type="submit"
            variant={"ctrl"}
            className="mt-6 min-w-27.5 text-sm "
            disabled={isLoading || isUpdatingProducts}
          >
            Save Changes
          </Button>
        </div>
        {/* <SelectElement
          name={"paymentCard"}
          options={cardsData || []}
          label="Credit Card"
          isRequired={false}
          errorClassName="text-right "
          //   placeholder="1247 Broadway Street"
          className="min-w-45 border-border placeholder:text-[#C3C1C6]"
          reserveSpace={true}
        /> */}
      </form>
    </Form>
  );
}
export default function EditOrder({
  patientId,
  address,
  existingProducts,
  encounterId,
  projectId,
  defaultPaymentMethodId,
}: EditOrderProps) {
  const [openEditOrderDialog, setOpenEditOrderDialog] = useState(false);

  const { data: addressData, isLoading: isAddressLoading } =
    useViewPatientByIdQuery(patientId!, {
      skip: !patientId,
      selectFromResult: ({ data, isLoading }) => ({
        data: {
          address: data?.addresses?.map((address) => {
            return {
              id: address?.id,
              address1: address?.billing?.address1,
              address2: address?.billing?.address2 || undefined,
              city: address?.billing?.city,
              state: {
                id: address?.billing?.state?.id,
                name: address?.billing?.state?.name,
              },
              zipcode: address?.billing?.zipcode,
            };
          }),
        },
        isLoading,
      }),
    });

  const { data: statesData, isLoading: isStatesLoading } =
    useViewAllStatesQuery(undefined, {
      selectFromResult: ({ data, isLoading }) => ({
        data: data?.map((item) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        }), // Adjust the `map` function if you want to transform `item`
        isLoading,
      }),
    });

  const { data: paymentData, isLoading: isPaymentMethodLoading } =
    useGetAvailablePaymentMethodsQuery(
      {
        patientId,
      },
      {
        skip: !openEditOrderDialog,
        selectFromResult: ({ data, isLoading }) => ({
          data: data?.map((item) => {
            return {
              label: `${item?.cardBrand} **** ${item?.last4} (Expires ${item?.expMonth}/${item?.expYear})`,
              value: item?.paymentId,
            };
          }),
          isLoading,
        }),
      }
    );

  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenEditOrderDialog(true)}
        className="min-w-27.5 text-sm font-semibold "
      >
        Edit Order
      </Button>

      <ConfirmDialog
        // isLoading={isLoading}
        containerWidth="min-w-[900px]"
        open={openEditOrderDialog}
        onOpenChange={setOpenEditOrderDialog}
        title="Edit Order"
        // description={`Sure you want to delete this encounter?\nRemember you can’t undo this.`}
        onConfirm={() => {}}
        showFooter={false}
      >
        {isAddressLoading || isStatesLoading || isPaymentMethodLoading ? (
          <div className="h-40 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <UpdateEncounterOrder
            encounterId={encounterId}
            projectId={projectId}
            open={openEditOrderDialog}
            setOpen={setOpenEditOrderDialog}
            existingProducts={
              existingProducts?.map((item: any) => {
                return {
                  productVariation: item?.productVariation?._id,
                  name: [
                    item?.productVariation?.product?.title,
                    item?.productVariation?.strength,
                    item?.productVariation?.form,
                  ]
                    ?.filter(Boolean)
                    .join(","),
                  quantity: item?.quantity,
                };
              }) || []
            }
            cardsData={paymentData || []}
            address={addressData?.address || []}
            statesData={statesData || []}
            defaultAddress={address}
            defaultPaymentMethodId={defaultPaymentMethodId}
          />
        )}
      </ConfirmDialog>
    </>
  );
}
