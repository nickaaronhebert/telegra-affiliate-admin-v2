import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViewAllProductsQuery } from "@/redux/services/product";
import { toast } from "sonner";
import { PRODUCT_TYPES } from "@/constants";

interface ProductMappingProps {
  productData: any;
  onBack: () => void;
  onConfirmMapping: (mappingData: any) => void;
  isSubmitting?: boolean;
}

interface TelegraProduct {
  id: string;
  name: string;
}

interface MappingState {
  [key: string]: string; // variationKey -> telegraProductId
}

const ProductMapping = ({
  productData,
  onBack,
  onConfirmMapping,
  isSubmitting = false,
}: ProductMappingProps) => {
  const [mappingState, setMappingState] = useState<MappingState>({});

  const {
    data: telegraProducts,
    isLoading,
    error,
  } = useViewAllProductsQuery({
    page: 1,
    perPage: 100, // Get enough products for mapping
    q: "", // No search query, get all products
  });

  // Extract available Telegra product variations for dropdown options
  const availableProducts: TelegraProduct[] =
    telegraProducts?.productVariations?.map((variation) => ({
      id: variation.id,
      name: `${variation.product.title} - ${variation.description} (${variation.strength})`,
    })) || [];

  // Generate variations based on product type
  const getVariationsToMap = () => {
    if (
      productData.productType === PRODUCT_TYPES.ONE_TIME ||
      productData.productType === PRODUCT_TYPES.SUBSCRIPTION_FIXED
    ) {
      return [
        {
          key: "main",
          name: productData.name,
        },
      ];
    }

    if (productData.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
      return (
        productData.variations?.map((variation: any, index: number) => ({
          key: `variation-${index}`,
          name: variation.name,
        })) || []
      );
    }

    return [];
  };

  const variations = getVariationsToMap();

  const handleMappingChange = (
    variationKey: string,
    telegraProductId: string
  ) => {
    setMappingState((prev) => ({
      ...prev,
      [variationKey]: telegraProductId,
    }));
  };

  const isAllMapped = () => {
    const result = variations.every(
      (variation: any) => mappingState[variation.key]
    );
    return result;
  };

  const handleConfirmMapping = () => {
    if (!isAllMapped()) {
      toast.error("Please map all variations before confirming");
      return;
    }

    const mappingData = {
      productData,
      mappings: variations.map((variation: any) => ({
        variationKey: variation.key,
        variationName: variation.name,
        telegraProductId: mappingState[variation.key],
        telegraProductName: availableProducts.find(
          (p) => p.id === mappingState[variation.key]
        )?.name,
      })),
    };

    onConfirmMapping(mappingData);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading Telegra products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading Telegra products. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Map "{productData.name}" to its clinical product in Telegra
        </h2>
      </div>

      <div className="space-y-6">
        {productData.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Left column - Your Variations */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Your Variations
                </h3>
                <div className="space-y-3">
                  {variations.map((variation: any) => (
                    <div
                      key={variation.key}
                      className="bg-white p-3 rounded-md border border-gray-200"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        {variation.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column - Mapping with Telegra */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Mapping with Telegra
                </h3>
                <div className="space-y-3">
                  {variations.map((variation: any) => (
                    <div key={variation.key}>
                      <Select
                        onValueChange={(value) =>
                          handleMappingChange(variation.key, value)
                        }
                        value={mappingState[variation.key] || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select the product" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Single variation UI for ONE_TIME and SUBSCRIPTION_FIXED
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegra Product *
              </label>
              <Select
                onValueChange={(value) => handleMappingChange("main", value)}
                value={mappingState["main"] || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={productData.name} />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end pt-6">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-full min-h-[44px] px-6 text-sm font-medium"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirmMapping}
              className="rounded-full min-h-[44px] px-6 text-sm font-medium text-white cursor-pointer"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {isSubmitting ? "Creating Mapping..." : "Confirm Mapping"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMapping;
