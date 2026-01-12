import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { productsSchema } from "@/schemas/productVariationschema";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
// import SelectElement from "@/components/Form/select-element";
// import InputElement from "@/components/Form/input-element";
// import TextAreaElement from "@/components/Form/textarea-elements";
import { useAppDispatch } from "@/redux/store";
import {
  //   updateStepOne,
  prevStep,
  updateStepOne,
  type SELECT_PRODUCT,
  //   type SELECT_MEDICATION,
} from "@/redux/slices/create-order";
// import { productsSchema } from "@/schemas/selectEcommerceProduct";
import SelectElement from "@/components/Form/SelectElement";
import InputNumberElement from "@/components/Form/InputNumberElement";
import { productsSchema } from "@/schemas/selectEcommerceProduct";
import { useViewAllEcommerceProductVariationsQuery } from "@/redux/services/product";

interface SelectProductVariationProps {
  product: SELECT_PRODUCT;
  disabled?: boolean;
}
export default function SelectProductVariation({
  product,
  disabled = false,
}: SelectProductVariationProps) {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useViewAllEcommerceProductVariationsQuery(
    { page: 1, limit: 100 },
    {
      selectFromResult: ({ data, isLoading }) => ({
        data: data?.mappings?.map((item) => {
          return {
            label: item.name,
            value: `${item.id}?${item.regularPrice}?${item.name}`,
          };
        }),
        isLoading,
      }),
    }
  );

  const form = useForm<z.input<typeof productsSchema>>({
    // mode: "onTouched",
    resolver: zodResolver(productsSchema),

    // ⭐ Default values go here
    defaultValues: {
      productVariations: product.productVariations,
      //   productVariations: [
      //     {
      //       productVariation: "",
      //       quantity: 1,
      //       pricePerUnitOverride: 0,
      //     },
      //   ],
    },
  });

  async function onSubmit(values: z.input<typeof productsSchema>) {
    const payload = values?.productVariations?.map((item) => {
      // const [id, _] = item.productVariation.split("/");
      return {
        productVariation: item.productVariation,
        quantity: item.quantity as number,
        pricePerUnitOverride: item.pricePerUnitOverride as number,
        productName: item.productName,
      };
    });

    dispatch(updateStepOne({ productVariations: payload }));
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
            <div className=" min-w-162.5 max-w-162.5">
              <div className=" flex justify-between mb-3">
                <p className="text-[20px] font-semibold">Select Medication</p>
                <Button
                  variant={"link"}
                  disabled={disabled}
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

                    <div className=" flex gap-4">
                      <SelectElement
                        disabled={disabled}
                        isLoading={isLoading}
                        loadingTitle="Loading Medication Records..."
                        name={`productVariations.${index}.productVariation`}
                        options={data || []}
                        label="Select Medication"
                        isRequired={true}
                        placeholder="Select a medication"
                        className="w-67.5 min-h-14"
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
                        disabled={disabled}
                        name={`productVariations.${index}.quantity`}
                        type="number"
                        label="Quantity"
                        isRequired={true}
                        inputClassName="max-w-[180px] min-h-14"
                        placeholder="30"
                      />

                      <InputNumberElement
                        disabled={disabled}
                        name={`productVariations.${index}.pricePerUnitOverride`}
                        type="number"
                        label="Price Per Unit"
                        isRequired={true}
                        inputClassName="max-w-[180px] min-h-14"
                        placeholder="0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between mt-10 border-t border-card-border border-dashed pt-10">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => dispatch(prevStep())}
              className="rounded-full min-h-12 min-w-32.5 text-[14px] font-semibold cursor-pointer "
            >
              Back
            </Button>

            <Button
              type="submit"
              className="rounded-full min-h-12 min-w-32.5 text-[14px] font-semibold text-white cursor-pointer"
              // disabled={!form.formState.isValid}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
