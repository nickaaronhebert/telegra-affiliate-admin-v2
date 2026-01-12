// import { useViewAllEcommerceProductVariationsQuery } from "@/redux/services/product";
import { useFieldArray, useFormContext } from "react-hook-form";
import SelectElement from "../SelectElement";
import InputNumberElement from "../InputNumberElement";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetProductVariationsListQuery } from "@/redux/services/productVariationsList";

export default function ProductVariations() {
  const { data } = useGetProductVariationsListQuery(
    { page: 1, limit: 100 },
    {
      selectFromResult: ({ data }) => ({
        data: data?.productVariations?.map((item) => {
          const description = item?.description;
          const title = item?.product?.title;

          return {
            label: `${description ? description : title}`,
            value: `${item?.id}`,
          };
        }),
      }),
    }
  );

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "afterResultsOrderProductVariations",
    control,
  });
  return (
    <div>
      <div className="flex justify-end my-2">
        <span
          className="text-sm font-semibold cursor-pointer underline underline-offset-2"
          onClick={() =>
            append({
              productVariation: "",

              quantity: "1",
            })
          }
        >
          + Add Product{" "}
        </span>
      </div>
      {fields.map((field, index) => {
        return (
          <div
            key={field.id}
            className={cn(
              index > 0 ? "mt-2.5 border-t pt-4 border-card-border" : ""
            )}
          >
            {/* {index > 0 && ( */}
            <div className="flex justify-end mb-2">
              <span
                className="flex gap-1 justify-center text-xs font-normal text-[#E31010] underline underline-offset-2 cursor-pointer"
                onClick={() => remove(index)}
              >
                <Trash2 size={14} /> Delete
              </span>
            </div>
            {/* )} */}

            <div className=" flex gap-4">
              <SelectElement
                // disabled={disabled}
                name={`afterResultsOrderProductVariations.${index}.productVariation`}
                options={data || []}
                label="Select Medication"
                isRequired={true}
                placeholder="Select a medication"
                reserveSpace={true}
                className="w-50 min-h-14"
              />

              <InputNumberElement
                // disabled={disabled}
                reserveSpace={true}
                name={`afterResultsOrderProductVariations.${index}.quantity`}
                type="number"
                label="Quantity"
                isRequired={true}
                inputClassName="max-w-[180px] min-h-14"
                placeholder="30"
              />

              {/* <InputNumberElement
                                // disabled={disabled}
                                name={`productVariations.${index}.pricePerUnitOverride`}
                                type="number"
                                label="Price Per Unit"
                                isRequired={true}
                                inputClassName="max-w-[180px] min-h-14"
                                placeholder="0"
                              /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
