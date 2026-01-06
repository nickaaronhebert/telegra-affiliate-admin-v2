import { ROUTES } from "@/constants/routes";
import { cn, getLocalStorage } from "@/lib/utils";
import { ChevronRight, Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreateEcommerceProductMutation,
  useCreateProductMappingMutation,
  useUpdateEcommerceProductMutation,
  useViewEcommerceProductByIdQuery,
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
  name: string;
  description?: string;
  sku: string;
  productType: string;
  regularPrice?: string;
  subscriptionPeriod?: string;
  subscriptionPeriodInterval?: string;
  subscriptionLength?: string;
  variations?: any[];
}

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const isEditMode = !!productId;

  const [createEcommerceProduct, { isLoading: isCreating }] =
    useCreateEcommerceProductMutation();
  const [updateEcommerceProduct, { isLoading: isUpdating }] =
    useUpdateEcommerceProductMutation();
  const [createProductMapping, { isLoading: isMapping }] =
    useCreateProductMappingMutation();

  // Fetch existing product data if in edit mode
  const {
    data: existingProduct,
    isLoading: isFetchingProduct,
    error: fetchError,
  } = useViewEcommerceProductByIdQuery(productId || "", {
    skip: !productId,
  });

  const [currentStep, setCurrentStep] = useState<ProductStep>(
    PRODUCT_STEPS.ADD_PRODUCT
  );
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [apiResponse, setApiResponse] =
    useState<CreateEcommerceProductResponse | null>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  // Set initial form data from existing product when in edit mode
  useEffect(() => {
    if (isEditMode && existingProduct) {
      const formData = transformApiResponseToFormData(existingProduct);
      setInitialFormData(formData);
      setProductData(formData);
      // Start at mapping step if coming back from refresh in edit mode
      setCurrentStep(PRODUCT_STEPS.MAPPING);
    }
  }, [isEditMode, existingProduct]);

  // Reset state when not in edit mode (fresh create)
  useEffect(() => {
    if (!productId) {
      setCurrentStep(PRODUCT_STEPS.ADD_PRODUCT);
      setProductData(null);
      setApiResponse(null);
      setInitialFormData(null);
    }
  }, [productId]);

  // Transform API response to form data format
  const transformApiResponseToFormData = (product: any) => {
    const baseData = {
      name: product.name || "",
      description: product.description || "",
      sku: product.sku || "",
      productType: product.productType || "",
    };

    if (product.productType === PRODUCT_TYPES.ONE_TIME) {
      return {
        ...baseData,
        regularPrice: product.regularPrice?.toString() || "",
        subscriptionPeriod: "",
        subscriptionPeriodInterval: "",
        subscriptionLength: "",
        variations: [],
      };
    }

    if (product.productType === PRODUCT_TYPES.SUBSCRIPTION_FIXED) {
      return {
        ...baseData,
        regularPrice: product.regularPrice?.toString() || "",
        subscriptionPeriod: product.subscriptionPeriod || "",
        subscriptionPeriodInterval: product.subscriptionPeriodInterval?.toString() || "1",
        subscriptionLength: product.subscriptionLength?.toString() || "0",
        variations: [],
      };
    }

    if (product.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
      return {
        ...baseData,
        regularPrice: "",
        subscriptionPeriod: "",
        subscriptionPeriodInterval: "",
        subscriptionLength: "",
        variations: product.variations?.map((v: any) => ({
          name: v.name || "",
          regularPrice: v.regularPrice?.toString() || "",
          subscriptionPeriod: v.subscriptionPeriod || "",
          periodLength: v.subscriptionPeriodInterval?.toString() || "1",
          subscriptionLength: v.subscriptionLength?.toString() || "0",
        })) || [],
      };
    }

    return baseData;
  };

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

      if (isEditMode && productId) {
        // Update existing product
        await updateEcommerceProduct({ id: productId, data: apiPayload }).unwrap();

        toast.success("Product updated successfully!", {
          duration: 2000,
        });

        setProductData(data);
        setCurrentStep(PRODUCT_STEPS.MAPPING);
      } else {
        // Create new product
        const result = await createEcommerceProduct(apiPayload).unwrap();

        toast.success("Product created successfully!", {
          duration: 2000,
        });

        setProductData(data);
        setApiResponse(result);

        // Navigate to edit mode URL with the new product ID
        const newProductId = result.product?.id;
        if (newProductId) {
          navigate(`/products/create/${newProductId}`, { replace: true });
        }
        
        setCurrentStep(PRODUCT_STEPS.MAPPING);
      }
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        data?: {
          message?: string;
        };
      };
      const message =
        err?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`;
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
      // In edit mode, use existingProduct; in create mode, use apiResponse
      if (!apiResponse && !existingProduct) {
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
    // For edit mode, get variation IDs from existing product
    if (isEditMode && existingProduct) {
      if (productData?.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
        const index = parseInt(variationKey.split("-")[1]);
        return existingProduct.ecommerceProductVariations?.[index] || "";
      } else {
        return existingProduct.ecommerceProductVariations?.[0] || "";
      }
    }

    // For create mode, get from API response
    if (!apiResponse) return "";

    if (productData?.productType === PRODUCT_TYPES.SUBSCRIPTION_VARIABLE) {
      const index = parseInt(variationKey.split("-")[1]);
      return apiResponse.product.ecommerceProductVariations[index]?.id || "";
    } else {
      return apiResponse.product.ecommerceProductVariations[0]?.id || "";
    }
  };

  const renderCurrentStep = () => {
    // Show loading state when fetching product in edit mode
    if (isEditMode && isFetchingProduct) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 animate-spin text-gray-600" />
            <p className="text-sm text-gray-600">Loading product details...</p>
          </div>
        </div>
      );
    }

    // Show error state if fetch failed
    if (isEditMode && fetchError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-red-600">Failed to load product details. Please try again.</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case PRODUCT_STEPS.ADD_PRODUCT:
        return (
          <AddProductDetails
            onCancel={handleCancel}
            onContinue={handleContinueToMapping}
            isSubmitting={isCreating || isUpdating}
            initialData={initialFormData}
            isEditMode={isEditMode}
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
            isSubmitting={isCreating || isUpdating}
            initialData={initialFormData}
            isEditMode={isEditMode}
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

        <h1 className="text-2xl font-bold mt-1">{isEditMode ? "Edit Product" : "Add Product"}</h1>
      </div>
      <div
        className="m-10 rounded-[15px] max-w-[815px] mx-auto p-6 bg-white"
        
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
