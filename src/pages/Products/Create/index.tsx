import { ROUTES } from "@/constants/routes";
import { cn, getLocalStorage } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreateEcommerceProductMutation,
  useCreateProductMappingMutation,
} from "@/redux/services/product";
import { LOCAL_STORAGE_KEYS, PRODUCT_TYPES } from "@/constants";
import type { User } from "@/types/global/commonTypes";
import type { CreateEcommerceProductResponse } from "@/types/responses/ecommerceProductCreation";
import AddProductDetails from "./AddProductDetails";
import ProductMapping from "./ProductMapping";

const PRODUCT_STEPS = {
  ADD_PRODUCT: 0,
  MAPPING: 1,
  SUCCESS: 2,
} as const;

type ProductStep = (typeof PRODUCT_STEPS)[keyof typeof PRODUCT_STEPS];

interface ProductFormData {
  productName: string;
  productDescription: string;
  sku: string;
  productType: string;
  regularPrice: string;
  imageUrl?: string;
}

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [createEcommerceProduct, { isLoading: isCreating }] =
    useCreateEcommerceProductMutation();
  const [createProductMapping, { isLoading: isMapping }] =
    useCreateProductMappingMutation();
  const [currentStep, setCurrentStep] = useState<ProductStep>(
    PRODUCT_STEPS.ADD_PRODUCT
  );
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [apiResponse, setApiResponse] =
    useState<CreateEcommerceProductResponse | null>(null);

  // Reset to step 1 on page refresh or initial load
  useEffect(() => {
    setCurrentStep(PRODUCT_STEPS.ADD_PRODUCT);
    setProductData(null);
    setApiResponse(null);
  }, []);

  const handleCancel = () => {
    navigate(ROUTES.PRODUCTS_PATH);
  };

  const transformFormDataToApiPayload = (data: any) => {
    const user = getLocalStorage<User>(LOCAL_STORAGE_KEYS.USER);

    if (!user?.affiliate) {
      throw new Error("No affiliate found in user data");
    }

    const basePayload = {
      name: data.name,
      description: data.description || "",
      sku: data.sku,
      productType: data.productType,
      affiliate: user.affiliate,
    };

    if (data.productType === PRODUCT_TYPES.ONE_TIME) {
      return {
        ...basePayload,
        regularPrice: parseFloat(data.regularPrice),
      };
    }

    if (data.productType === PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
      return {
        ...basePayload,
        regularPrice: parseFloat(data.regularPrice),
        subscriptionPeriod: data.subscriptionPeriod,
        subscriptionPeriodInterval: parseInt(data.subscriptionPeriodInterval),
        subscriptionLength: data.subscriptionLength
          ? parseInt(data.subscriptionLength)
          : 0,
      };
    }

    if (data.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
      const transformedVariations = data.variations
        .filter((v: any) => v.name && v.regularPrice && v.subscriptionPeriod)
        .map((v: any) => ({
          name: v.name,
          regularPrice: parseFloat(v.regularPrice),
          subscriptionPeriod: v.subscriptionPeriod,
          subscriptionPeriodInterval: v.periodLength ? parseInt(v.periodLength) : 1,
          subscriptionLength: v.subscriptionLength
            ? parseInt(v.subscriptionLength)
            : 0,
        }));

      return {
        ...basePayload,
        variations: transformedVariations,
      };
    }

    return basePayload;
  };

  const handleContinueToMapping = async (data: any) => {
    try {
      const apiPayload = transformFormDataToApiPayload(data);

      const result = await createEcommerceProduct(apiPayload).unwrap();

      toast.success("Product created successfully!", {
        duration: 2000,
      });

      setProductData(data);
      setApiResponse(result);
      setCurrentStep(PRODUCT_STEPS.MAPPING);
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };
      const message =
        err?.data?.message || "Failed to create product. Please try again.";
      toast.error(message, {
        duration: 2000,
      });
    }
  };

  const handleBackToProductDetails = () => {
    setCurrentStep(PRODUCT_STEPS.ADD_PRODUCT);
  };

  const handleConfirmMapping = async (mappingData: any) => {
    try {
      if (!apiResponse) {
        toast.error("Product data not found. Please try again.");
        return;
      }

      const mappingPayload = {
        mappings: mappingData.mappings.map((mapping: any) => ({
          ecommerceProductVariationId: getEcommerceVariationId(
            mapping.variationKey
          ),
          productVariationId: mapping.telegraProductId,
        })),
      };

      await createProductMapping(mappingPayload).unwrap();

      toast.success("Product mapping completed successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        navigate(ROUTES.PRODUCTS_PATH);
      }, 1000);
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };
      const message =
        err?.data?.message || "Failed to create mapping. Please try again.";
      toast.error(message, {
        duration: 2000,
      });
    }
  };

  const getEcommerceVariationId = (variationKey: string): string => {
    if (!apiResponse) return "";

    if (productData?.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
      const index = parseInt(variationKey.split("-")[1]);
      return apiResponse.product.ecommerceProductVariations[index]?.id || "";
    } else {
      return apiResponse.product.ecommerceProductVariations[0]?.id || "";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case PRODUCT_STEPS.ADD_PRODUCT:
        return (
          <AddProductDetails
            onCancel={handleCancel}
            onContinue={handleContinueToMapping}
            isSubmitting={isCreating}
          />
        );
      case PRODUCT_STEPS.MAPPING:
        return (
          <ProductMapping
            productData={productData}
            onBack={handleBackToProductDetails}
            onConfirmMapping={handleConfirmMapping}
            isSubmitting={isMapping}
          />
        );
      case PRODUCT_STEPS.SUCCESS:
        return (
          <div className="text-center py-16">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Product Created Successfully!
            </h2>
            <p className="text-gray-600">
              Your product has been created and mapped successfully.
            </p>
          </div>
        );
      default:
        return (
          <AddProductDetails
            onCancel={handleCancel}
            onContinue={handleContinueToMapping}
            isSubmitting={isCreating}
          />
        );
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "var(--lilac)" }} className="py-3 px-12">
        <Link
          to={ROUTES.PRODUCTS_PATH}
          className="font-normal text-sm text-muted-foreground"
        >
          {"<- Back to Products"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">Add Product</h1>
      </div>
      <div
        className="mt-3 rounded-[15px] max-w-[815px] mx-auto p-6 bg-white"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        {/* Stepper Header */}
        <div
          className="pt-2.5 pb-2.5 px-5 flex gap-2.5 justify-center border-b border-dashed mb-4"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p
            className={cn(
              "text-base font-semibold flex gap-3",
              currentStep >= PRODUCT_STEPS.ADD_PRODUCT
                ? "text-primary"
                : "text-[#63627F]"
            )}
          >
            <span>1.</span>
            <span>Add Product</span>
          </p>
          <ChevronRight className="text-gray-400" />
          <p
            className={cn(
              "text-base font-semibold flex gap-3",
              currentStep >= PRODUCT_STEPS.MAPPING
                ? "text-primary"
                : "text-[#63627F]"
            )}
          >
            <span>2.</span>
            <span>Mapping</span>
          </p>
        </div>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </>
  );
};

export default CreateProductPage;
