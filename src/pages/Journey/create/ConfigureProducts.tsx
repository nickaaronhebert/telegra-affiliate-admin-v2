import { ProductVariationsSearch } from "@/components/common/ProductVariationsSearch";
import type { ProductVariationItem } from "@/types/global/productVariationData";

interface ConfigureProductsProps {
  selectedProductVariations: ProductVariationItem[];
  onProductVariationsChange: (data: ProductVariationItem[]) => void;
}

const ConfigureProducts = ({
  selectedProductVariations,
  onProductVariationsChange,
}: ConfigureProductsProps) => {
  console.log("selectedProductVariations",selectedProductVariations);
  return (
    <>
      <div className="flex flex-col mb-6">
        <span className="text-lg font-semibold">Configure Products</span>
        <span className="text-base text-[#63627F]">
          Set up product details and subscription preferences for this journey.
        </span>
      </div>

      <div className="rounded-lg p-6 w-[50%] mx-auto bg-white border border-[#F4F4F4]">
        <ProductVariationsSearch
          selectedData={selectedProductVariations}
          onSelect={(data: ProductVariationItem[]) => {
            onProductVariationsChange(data);
          }}
          acceptMultiple={true}
        />
      </div>
    </>
  );
};

export default ConfigureProducts;