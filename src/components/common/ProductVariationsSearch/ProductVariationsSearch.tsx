import { useEffect, useState } from "react";
import { Info, Link, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProductVariationsQuery } from "@/redux/services/productVariations";
import { productVariationType } from "@/constants";

import type { ProductVariationMapping } from "@/types/responses/productVariations";

interface ProductVariationItem {
  id: string;
  productVariation: ProductVariationMapping | null;
  quantity: number;
  pricePerUnitOverride: number;
  billingCycleLength?: number;
}

interface ProductVariationsSearchProps {
  selectedData?: ProductVariationItem[];
  onSelect: (data: ProductVariationItem[]) => void;
  acceptMultiple?: boolean;
}

export function ProductVariationsSearch({
  selectedData,
  onSelect,
  acceptMultiple = true,
}: ProductVariationsSearchProps) {
  const [productVariationItems, setProductVariationItems] = useState<
    ProductVariationItem[]
  >(
    selectedData && selectedData.length > 0
      ? selectedData
      : [
          {
            id: crypto.randomUUID(),
            productVariation: null,
            quantity: 1,
            pricePerUnitOverride: 0,
            billingCycleLength: 0,
          },
        ]
  );

  useEffect(() => {
    if (selectedData && selectedData.length > 0) {
      setProductVariationItems(selectedData);
    }
  }, []);

  // Notify parent of changes
  useEffect(() => {
    onSelect(productVariationItems);
  }, [productVariationItems]);

  const { data: productVariations, isFetching } = useGetProductVariationsQuery(
    {
      page: 1,
      limit: 100,
      isMapped: true,
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          data: data?.mappings || [],
          isFetching: isFetching,
        };
      },
    }
  );

  const addProductVariationRow = () => {
    if (!acceptMultiple) return;

    const newItem: ProductVariationItem = {
      id: crypto.randomUUID(),
      productVariation: null,
      quantity: 1,
      pricePerUnitOverride: 0,
      billingCycleLength: 0,
    };
    setProductVariationItems([...productVariationItems, newItem]);
  };

  const removeProductVariationRow = (itemId: string) => {
    if (productVariationItems.length <= 1) return;
    setProductVariationItems(
      productVariationItems.filter((item) => item.id !== itemId)
    );
  };

  const updateProductVariationItem = (
    itemId: string,
    updates: Partial<ProductVariationItem>
  ) => {
    setProductVariationItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const handleProductVariationChange = (itemId: string, value: string) => {
    if (value === "none") {
      updateProductVariationItem(itemId, {
        productVariation: null,
        pricePerUnitOverride: 0,
        billingCycleLength: 0,
      });
      return;
    }

    const selected = productVariations?.find((pv) => pv.id === value);
    if (selected) {
      updateProductVariationItem(itemId, {
        productVariation: selected,
        pricePerUnitOverride: selected.regularPrice,
        billingCycleLength: 0,
      });
    }
  };

  const getAvailableProductVariations = (currentItemId: string) => {
    const selectedIds = productVariationItems
      .filter((item) => item.id !== currentItemId && item.productVariation)
      .map((item) => item.productVariation!.id);

    return (
      productVariations?.filter((pv) => !selectedIds.includes(pv.id)) || []
    );
  };

  const isSubscriptionProduct = (productType: string) =>
    productType === productVariationType.SUBSCRIPTION_FIXED ||
    productType === productVariationType.SUBSCRIPTION_VARIABLE;

  return (
    <div className="space-y-6">
      {/* Add Product Variation Button */}
      {acceptMultiple && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Product variations</h3>
          <Link
            type="button"
            size="sm"
            onClick={addProductVariationRow}
            className="text-blue-500 border-none bg-white flex items-center hover:underline hover:bg-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Product Variation
          </Link>
        </div>
      )}

      {/* Product Variation Rows */}
      <div className="space-y-6">
        {productVariationItems.map((item, index) => {
          const availableVariations = getAvailableProductVariations(item.id);
          const showSubscriptionFields =
            item.productVariation &&
            isSubscriptionProduct(item.productVariation.productType);

          return (
            <div key={item.id} className="relative">
              {/* Remove button - only show if multiple items and acceptMultiple is true */}
              {acceptMultiple && productVariationItems.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProductVariationRow(item.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="text-sm text-gray-600 mb-4 text-[10px]">
                PRODUCT {index + 1}
              </div>

              <div className="space-y-4 p-6 bg-[var(--background)] border border-[#F4F4F4] rounded-lg">
                {/* Product Variation Dropdown */}
                <div className="space-y-2 w-full justify-center">
                  <Label htmlFor={`product-variation-${item.id}`}>
                    Product Variation
                  </Label>
                  <Select
                    value={item.productVariation?.id || "none"}
                    onValueChange={(value) =>
                      handleProductVariationChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="bg-white  w-full">
                      <SelectValue
                        placeholder={
                          isFetching
                            ? "Loading..."
                            : "Select a product variation"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No selection</SelectItem>
                      {availableVariations.map((productVariation) => (
                        <SelectItem
                          key={productVariation.id}
                          value={productVariation.id}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium align-left justify-start ">
                              {productVariation.name}
                            </span>
                            {/* <span className="text-xs text-gray-500">
                              ${productVariation.regularPrice} • {productVariation.productType}
                              {productVariation.subscriptionPeriod && (
                                <span>
                                  {" "}
                                  • Every {productVariation.subscriptionPeriodInterval}{" "}
                                  {productVariation.subscriptionPeriod}(s)
                                </span>
                              )}
                            </span> */}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {item.productVariation && (
                  <>
                    {/* Quantity Input */}
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        className="bg-white"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateProductVariationItem(item.id, {
                            quantity: Math.max(
                              1,
                              parseInt(e.target.value) || 1
                            ),
                          })
                        }
                      />
                    </div>

                    {/* Overwrite Price Input */}
                    <div className="space-y-2">
                      <Label htmlFor={`overwrite-price-${item.id}`}>
                        Overwrite Price ($)
                      </Label>
                      <Input
                        id={`overwrite-price-${item.id}`}
                        className="bg-white"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.pricePerUnitOverride}
                        onChange={(e) =>
                          updateProductVariationItem(item.id, {
                            pricePerUnitOverride: Math.max(
                              0,
                              parseFloat(e.target.value) || 0
                            ),
                          })
                        }
                      />
                    </div>

                    {/* Billing Cycle Length - Only for subscription products */}
                    {showSubscriptionFields && (
                      <div className="space-y-2">
                        <Label htmlFor={`billing-cycle-${item.id}`}>
                          Billing Cycle Length
                        </Label>
                        <Input
                          id={`billing-cycle-${item.id}`}
                          type="number"
                          className="bg-white"
                          min="0"
                          value={item.billingCycleLength || 0}
                          onChange={(e) =>
                            updateProductVariationItem(item.id, {
                              billingCycleLength: Math.max(
                                0,
                                parseInt(e.target.value) || 0
                              ),
                            })
                          }
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Info className="h-4 w-4" />
                          <span>0 means unlimited subscription length</span>
                        </div>
                      </div>
                    )}

                    {/* Product Details Display */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium text-base mb-2">
                        {item.productVariation.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p>
                            <span className="font-medium">Original Price:</span>{" "}
                            ${item.productVariation.regularPrice}
                          </p>
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            {item.productVariation.productType}
                          </p>
                          <p>
                            <span className="font-medium">Platform:</span>{" "}
                            {item.productVariation.ecommercePlatform}
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">Mapped to:</span>{" "}
                            {
                              item.productVariation?.mappedProductVariation
                                ?.name
                            }
                          </p>
                          {item.productVariation.subscriptionPeriod && (
                            <p>
                              <span className="font-medium">Billing:</span>{" "}
                              Every{" "}
                              {item.productVariation.subscriptionPeriodInterval}{" "}
                              {item.productVariation.subscriptionPeriod}(s)
                            </p>
                          )}
                          {item.productVariation.ecommerceVariationId && (
                            <p>
                              <span className="font-medium">Variation ID:</span>{" "}
                              {item.productVariation.ecommerceVariationId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
