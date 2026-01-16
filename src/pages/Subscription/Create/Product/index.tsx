import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { subscriptionSchema } from "@/schemas/productVariationschema";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

import { useAppDispatch, useTypedSelector } from "@/redux/store";

import SelectElement from "@/components/Form/SelectElement";
import InputNumberElement from "@/components/Form/InputNumberElement";
import { useViewAllEcommerceProductVariationsQuery } from "@/redux/services/product";
import { subscriptionSchema } from "@/schemas/createSubscriptionProductSchema";
import { prevStep, updateProductDetails } from "@/redux/slices/subscription";
import { useViewAllOrdersQuery } from "@/redux/services/order";
import { CenteredRow } from "@/components/ui/centered-row";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProductVariationProps {
  patientId: string;
}

const intervalOptions = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Year",
    value: "year",
  },
];
export default function ProductVariation({ patientId }: ProductVariationProps) {
  const productDetails = useTypedSelector(
    (state) => state.subscription.product
  );

  const dispatch = useAppDispatch();
  const { data } = useViewAllEcommerceProductVariationsQuery(
    { page: 1, limit: 100 },
    {
      selectFromResult: ({ data }) => ({
        data: data?.mappings?.map((item) => {
          return {
            label: item.name,
            value: `${item.id}?${item.regularPrice}?${item.name}`,
          };
        }),
      }),
    }
  );

  const { data: orderData } = useViewAllOrdersQuery(
    {
      page: 1,
      perPage: 100,
      patient: patientId,
    },
    {
      selectFromResult: ({ data }) => ({
        data: data?.result?.map((item) => {
          return {
            label: item.ecommerceOrderId,
            value: item.id,
          };
        }),
      }),
    }
  );

  const form = useForm<z.input<typeof subscriptionSchema>>({
    // mode: "onTouched",
    resolver: zodResolver(subscriptionSchema),

    // ⭐ Default values go here
    defaultValues: {
      order: productDetails?.order || "",
      interval: productDetails?.schedule?.interval || "",
      intervalCount: productDetails?.schedule?.intervalCount || 0,
      startDate: productDetails?.schedule?.startDate || "",
      endDate: productDetails?.schedule?.endDate || "",
      productVariations: productDetails?.productVariations || [
        {
          productVariation: "",
          quantity: 1,
          pricePerUnitOverride: 0,
          productName: "",
        },
      ],
    },
  });

  async function onSubmit(values: z.input<typeof subscriptionSchema>) {
    dispatch(
      updateProductDetails({
        order: values?.order,
        schedule: {
          interval: values?.interval,
          intervalCount: values?.intervalCount as number,
          startDate: values?.startDate,
          endDate: values?.endDate,
        },
        productVariations: values?.productVariations.map((item) => {
          return {
            productName: item?.productName,
            productVariation: item?.productVariation,
            pricePerUnitOverride: item?.pricePerUnitOverride as number,
            quantity: item?.quantity as number,
          };
        }),
      })
    );
  }

  const { fields, append, remove } = useFieldArray({
    name: "productVariations",
    control: form.control,
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex flex-col items-center">
            <div className="">
              <div className=" flex justify-between mb-3">
                <p className="text-[20px] font-semibold">Select Medication</p>
                <Button
                  type="button"
                  variant={"link"}
                  //disabled={disabled}
                  className="cursor-pointer !hover:no-underline"
                  onClick={() =>
                    append({
                      productVariation: "",
                      productName: "",
                      quantity: 1,
                      pricePerUnitOverride: 0,
                    })
                  }
                >
                  <span className="underline">Add Medication</span>
                </Button>
              </div>

              <SelectElement
                reserveSpace={true}
                name="order"
                options={orderData || []}
                label="Ecommerce Order"
                isRequired={true}
                placeholder="Select ecommerce order"
                className="w-full min-h-14"
                errorClassName="text-right"
              />
              {fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className={cn(
                      index > 0 ? "mt-2.5 border-t pt-4 border-card-border" : ""
                    )}
                  >
                    {index > 0 && (
                      <div className="flex justify-end mb-2">
                        <span
                          className="flex gap-1 justify-center text-xs font-normal text-[#E31010] underline underline-offset-2 cursor-pointer"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={14} /> Delete
                        </span>
                      </div>
                    )}

                    <div className=" flex gap-4 my-2">
                      <SelectElement
                        // disabled={disabled}
                        reserveSpace={true}
                        name={`productVariations.${index}.productVariation`}
                        options={data || []}
                        label="Select Medication"
                        isRequired={true}
                        placeholder="Select a medication"
                        className="w-[250px] min-h-14"
                        onChange={(value) => {
                          const [_, price, name] = value.split("?");
                          if (price) {
                            form.setValue(
                              `productVariations.${index}.pricePerUnitOverride`,
                              Number(price)
                            );
                          }
                          if (name) {
                            form.setValue(
                              `productVariations.${index}.productName`,
                              name
                            );
                          }
                          //   form.setValue(
                          //     `productVariations.${index}.productVariation`,
                          //     id
                          //   );
                        }}
                      />

                      <InputNumberElement
                        // disabled={disabled}
                        name={`productVariations.${index}.quantity`}
                        type="number"
                        label="Quantity"
                        isRequired={true}
                        inputClassName="max-w-[100px] min-h-14"
                        placeholder="30"
                        reserveSpace={true}
                      />

                      <InputNumberElement
                        // disabled={disabled}
                        name={`productVariations.${index}.pricePerUnitOverride`}
                        type="number"
                        label="Price"
                        isRequired={true}
                        inputClassName="max-w-[100px] min-h-14"
                        placeholder="0"
                        reserveSpace={true}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="max-w-[500px]">
                <p className="font-semibold text-xl">Schedule</p>
                <CenteredRow>
                  <SelectElement
                    reserveSpace={true}
                    name="interval"
                    options={intervalOptions || []}
                    label="Interval"
                    isRequired={true}
                    placeholder="Select Interval"
                    className="min-w-[230px] min-h-14 "
                    errorClassName="text-right"
                  />
                  <InputNumberElement
                    // disabled={disabled}
                    name={`intervalCount`}
                    type="number"
                    min={0}
                    label="Interval Count"
                    isRequired={true}
                    inputClassName="min-w-[230px] min-h-14"
                    placeholder="30"
                    reserveSpace={true}
                    messageClassName="text-right"
                  />
                </CenteredRow>

                {/* <CenteredRow>
                  <DateInputElement
                    name={"startDate"}
                    label="Start Date"
                    isRequired={true}
                    inputClassName="min-w-[230px] min-h-14"
                    placeholder="MM/DD/YYYY"
                    reserveSpace={true}
                    messageClassName="text-right"
                  />

                  <DateInputElement
                    name={"endDate"}
                    label="End Date"
                    isRequired={true}
                    inputClassName="min-w-[230px] min-h-14"
                    placeholder="MM/DD/YYYY"
                    reserveSpace={true}
                    messageClassName="text-right"
                  />
                </CenteredRow> */}
                <CenteredRow>
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel className="font-semibold" >Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="w-[230px] min-h-14"
                            required
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel className="font-semibold">End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="w-[230px] min-h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                </CenteredRow>

              </div>
            </div>
          </div>
          <div className="flex justify-between mt-10 border-t border-card-border border-dashed pt-10">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => dispatch(prevStep())}
              className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold cursor-pointer "
            >
              Back
            </Button>

            <Button
              type="submit"
              className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold text-white cursor-pointer"
            //   disabled={!form.formState.isValid}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
