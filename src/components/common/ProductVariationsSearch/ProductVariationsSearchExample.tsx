import { useState } from "react";
import { ProductVariationsSearch } from "@/components/common/ProductVariationsSearch";
import type { ProductVariationItem } from "@/types/global/productVariationData";

export function ProductVariationsSearchExample() {
  const [selectedData, setSelectedData] = useState<ProductVariationItem[]>([]);

  const calculateTotal = (items: ProductVariationItem[]) => {
    return items.reduce((total, item) => {
      if (item.productVariation) {
        return total + (item.pricePerUnitOverride * item.quantity);
      }
      return total;
    }, 0);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Product Variations Search</h2>

      <div className="max-w-4xl">
        <ProductVariationsSearch
          selectedData={selectedData}
          onSelect={setSelectedData}
          acceptMultiple={true}
        />
      </div>

      {selectedData.length > 0 && selectedData.some(item => item.productVariation) && (
        <div className="mt-4 p-4 border rounded-lg bg-blue-50">
          <h3 className="font-medium text-lg mb-4">Selected Configuration:</h3>
          <div className="space-y-4">
            {selectedData.map((item, index) => {
              if (!item.productVariation) return null;
              return (
                <div key={item.id} className="p-3 border rounded bg-white">
                  <h4 className="font-medium mb-2">Product {index + 1}: {item.productVariation.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><span className="font-medium">Type:</span> {item.productVariation.productType}</p>
                      <p><span className="font-medium">Original Price:</span> ${item.productVariation.regularPrice}</p>
                      <p><span className="font-medium">Platform:</span> {item.productVariation.ecommercePlatform}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                      <p><span className="font-medium">Override Price:</span> ${item.pricePerUnitOverride}</p>
                      <p><span className="font-medium">Line Total:</span> ${(item.pricePerUnitOverride * item.quantity).toFixed(2)}</p>
                      {(item.productVariation.productType === "SUBSCRIPTION_FIXED" ||
                        item.productVariation.productType === "SUBSCRIPTION_VARIABLE") && (
                        <p>
                          <span className="font-medium">Billing Cycle:</span> {item.billingCycleLength === 0 ? "Unlimited" : item.billingCycleLength}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}\n            <div className="p-3 bg-gray-100 rounded font-medium">
              <p>Total Amount: ${calculateTotal(selectedData).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}