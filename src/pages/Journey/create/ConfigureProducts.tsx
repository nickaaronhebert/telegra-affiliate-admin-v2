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
  return (
    <div className="pb-20">
      <div className="flex flex-col mb-6">
        <span className="text-2xl font-medium">Configure Products</span>
        <span className="text-base text-[#63627F]">
          Set up product details and subscription preferences for this journey.
        </span>
      </div>

      <div className="rounded-lg p-6 w-[50%] mx-auto bg-white">
        <ProductVariationsSearch
          selectedData={selectedProductVariations}
          onSelect={(data: ProductVariationItem[]) => {
            onProductVariationsChange(data);
          }}
          acceptMultiple={true}
        />
      </div>
    </div>
  );
};

export default ConfigureProducts;