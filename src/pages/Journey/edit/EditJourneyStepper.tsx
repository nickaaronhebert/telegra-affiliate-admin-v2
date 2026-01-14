import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { journeySchema } from "@/schemas/journeySchema";
import type { ProductVariationItem } from "@/types/global/productVariationData";
import type { ProductVariationMapping } from "@/types/responses/productVariations";
import type { Questionnaire } from "@/types/responses/questionnaire";
import ConfigureProducts from "../create/ConfigureProducts";
import ConfigureQuestionnaire from "../create/ConfigureQuestionnaire";
import FinalReviewStep from "../create/FinalReviewStep";
import ThemeSelection from "../create/ThemeSelection";
import TickSVG from "@/assets/icons/Tick";
import { STEPPER_STEPS } from "../create/constants";
import StepperFooter from "../create/StepperFooter";
import type { IGetJourneyById } from "@/types/responses/journey";

interface QuestionnaireItem {
  id: string;
  questionnaire: Questionnaire | null;
}

interface EditJourneyStepperProps {
  form: ReturnType<typeof useForm<z.infer<typeof journeySchema>>>;
  onSubmit: (values: z.infer<typeof journeySchema>) => void;
  isSubmitting?: boolean;
  existingJourneyData: IGetJourneyById;
}

/* ---------- Helpers ---------- */

const toProductVariationItems = (source: any[]): ProductVariationItem[] =>
  source
    .map((item) => {
      // Handle both cases: nested productVariation object OR direct properties
      const pv = item?.productVariation || item;

      // Check if we have required properties either in nested object or directly on item
      const hasRequiredProps =
        (pv?.id || item?.id) && (pv?.name || item?.name);

      if (!hasRequiredProps) return null;

      return {
        id: item.id ?? crypto.randomUUID(),
        productVariation: {
          id: pv.id ?? item.id,
          name: pv.name ?? item.name,
          ecommercePlatform: pv.ecommercePlatform ?? item.ecommercePlatform ?? "",
          ecommerceVariationId: pv.ecommerceVariationId ?? item.ecommerceVariationId,
          productType: pv.productType ?? item.productType ?? "",
          regularPrice: pv.regularPrice ?? item.regularPrice ?? 0,
          subscriptionPeriod: pv.subscriptionPeriod ?? item.subscriptionPeriod,
          subscriptionPeriodInterval: pv.subscriptionPeriodInterval ?? item.subscriptionPeriodInterval,
          isMapped: pv.isMapped ?? item.isMapped ?? true,
          mappedProductVariation: pv.mappedProductVariation ?? item.mappedProductVariation ?? {
            id: "",
            name: "",
          },
          systemMappingId: pv.systemMappingId ?? item.systemMappingId ?? "",
        } as ProductVariationMapping,
        quantity: item.quantity ?? 1,
        pricePerUnitOverride: item.pricePerUnitOverride ?? pv.regularPrice ?? item.regularPrice ?? 0,
        billingCycleLength: item.billingCycleLength ?? 0,
      } as ProductVariationItem;
    })
    .filter((item): item is ProductVariationItem => item !== null);

const toQuestionnaireItems = (source: any[]): QuestionnaireItem[] =>
  source
    .map((q, index) => {
      // Handle both cases: nested questionnaire object OR direct properties
      const questionnaire = q?.questionnaire || q;

      // Check if we have required properties (id or _id)
      const id = questionnaire?.id || questionnaire?._id;
      if (!id) return null;

      return {
        id: `questionnaire-${index}`,
        questionnaire: {
          id: id,
          name: questionnaire?.name ?? questionnaire?.title ?? "",
          title: questionnaire?.title ?? questionnaire?.name ?? "",
          active: questionnaire?.active ?? true,
          createdAt: questionnaire?.createdAt ?? "",
          updatedAt: questionnaire?.updatedAt ?? "",
        } as Questionnaire,
      } as QuestionnaireItem;
    })
    .filter((item): item is QuestionnaireItem => item !== null);

/* ---------- Component ---------- */

const EditJourneyStepper = ({
  form,
  onSubmit,
  isSubmitting,
  existingJourneyData,
}: EditJourneyStepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(
    STEPPER_STEPS.CONFIGURE_PRODUCTS.step
  );
  const [selectedProductVariations, setSelectedProductVariations] = useState<
    ProductVariationItem[]
  >([]);
  // const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<QuestionnaireItem[]>([]);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<{
    pre: QuestionnaireItem[];
    post: QuestionnaireItem[];
  }>({
    pre: [],
    post: [],
  });

  const initializedRef = useRef(false);

  /* ---------- Populate initial data ---------- */
  useEffect(() => {
    if (!existingJourneyData || initializedRef.current) return;
    initializedRef.current = true;

    const journey = (existingJourneyData.data || existingJourneyData) as any;

    if (journey?.productVariations?.length)
      setSelectedProductVariations(
        toProductVariationItems(journey.productVariations)
      );

    if (journey?.preCheckoutQuestionnaire?.length) {
      const pre = toQuestionnaireItems(
        journey.preCheckoutQuestionnaire.filter(
          (q: { isPreAuthQuestionnaire: any }) => q.isPreAuthQuestionnaire
        )
      );

      const post = toQuestionnaireItems(
        journey.preCheckoutQuestionnaire.filter(
          (q: { isPreAuthQuestionnaire: any }) => !q.isPreAuthQuestionnaire
        )
      );

      setSelectedQuestionnaires({ pre, post });
    }
  }, [existingJourneyData]);

  /* ---------- Navigation ---------- */

  const goNext = () => {
    if (currentStep === STEPPER_STEPS.CONFIGURE_PRODUCTS.step) {
      const validProductVariations = selectedProductVariations.filter(
        (item) => item.productVariation !== null
      );
      if (validProductVariations.length === 0) return;

      const formattedProducts = validProductVariations.map((item) => ({
        productVariation: item.productVariation!.id,
        quantity: item.quantity,
        pricePerUnitOverride: item.pricePerUnitOverride,
        billingCycleLength: item.billingCycleLength,
      }));
      form.setValue("productVariations", formattedProducts);
      return setCurrentStep(currentStep + 1);
    } else if (currentStep === STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step) {
      const validPre = selectedQuestionnaires.pre
        .filter((item) => item.questionnaire !== null)
        .map((item) => ({
          questionnaire: item.questionnaire!.id,
          isPreAuthQuestionnaire: true,
        }));

      const validPost = selectedQuestionnaires.post
        .filter((item) => item.questionnaire !== null)
        .map((item) => ({
          questionnaire: item.questionnaire!.id,
          isPreAuthQuestionnaire: false,
        }));

      form.setValue("preCheckoutQuestionnaire", [...validPre, ...validPost]);
      return setCurrentStep(currentStep + 1);
    } else if (currentStep === STEPPER_STEPS.THEME_SELECTION.step) {
      return setCurrentStep(currentStep + 1);
    } else if (currentStep === STEPPER_STEPS.FINAL_REVIEW.step) {
      // Final submit
      const products = selectedProductVariations
        .filter((item) => item.productVariation?.id)
        .map((item) => ({
          productVariation: item.productVariation!.id,
          quantity: item.quantity,
          pricePerUnitOverride: item.pricePerUnitOverride,
          billingCycleLength: item.billingCycleLength,
        }));

      const questionnaires = [
        ...selectedQuestionnaires.pre.map((item) => ({
          questionnaire: item.questionnaire!.id,
          isPreAuthQuestionnaire: true,
        })),
        ...selectedQuestionnaires.post.map((item) => ({
          questionnaire: item.questionnaire!.id,
          isPreAuthQuestionnaire: false,
        })),
      ];

      form.setValue("productVariations", products);
      form.setValue("preCheckoutQuestionnaire", questionnaires);

      const formValues = form.getValues();
      onSubmit(formValues);
    }
  };

  const goBack = () => {
    if (currentStep > STEPPER_STEPS.CONFIGURE_PRODUCTS.step) {
      if (currentStep === STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step) {
        const validPre = selectedQuestionnaires.pre
          .filter((item) => item.questionnaire !== null)
          .map((item) => ({
            questionnaire: item.questionnaire!.id,
            isPreAuthQuestionnaire: true,
          }));

        const validPost = selectedQuestionnaires.post
          .filter((item) => item.questionnaire !== null)
          .map((item) => ({
            questionnaire: item.questionnaire!.id,
            isPreAuthQuestionnaire: false,
          }));

        form.setValue("preCheckoutQuestionnaire", [...validPre, ...validPost]);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  /* ---------- Renderers ---------- */

  const renderConfigureProducts = () => {
    return (
      <ConfigureProducts
        selectedProductVariations={selectedProductVariations}
        onProductVariationsChange={setSelectedProductVariations}
      />
    );
  };

  const renderConfigureQuestionnaire = () => (
    <ConfigureQuestionnaire
      selectedProductVariations={selectedProductVariations}
      selectedQuestionnaires={selectedQuestionnaires}
      onQuestionnaireSelect={setSelectedQuestionnaires}
    />
  );

  const renderStepComponent = () => {
    switch (currentStep) {
      case STEPPER_STEPS.CONFIGURE_PRODUCTS.step:
        return renderConfigureProducts();
      case STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step:
        return renderConfigureQuestionnaire();
      case STEPPER_STEPS.THEME_SELECTION.step:
        return (
          <ThemeSelection
            onBack={goBack}
            onContinue={goNext}
            currentTheme={form.getValues("theme")}
            onThemeChange={(theme) => {
              console.log("Theme change detected in EditJourneyStepper:", theme);
              form.setValue("theme", theme);
            }}
          />
        );
      case STEPPER_STEPS.FINAL_REVIEW.step:
        return (
          <FinalReviewStep
            journeyName={form.getValues("name") || ""}
            selectedProductVariations={selectedProductVariations}
            selectedQuestionnaires={selectedQuestionnaires}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Stepper Header */}
      <div className="flex items-center justify-center mb-4 bg-white p-4 rounded-[15px]"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}>
        {[1, 2, 3, 4].map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted
                  ? "bg-[#DCFCE7] text-white"
                  : isCurrent
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                {isCompleted ? <TickSVG /> : step}
              </div>

              <span
                className={`ml-2 text-sm font-medium ${isCurrent ? "text-primary" : ""
                  }`}
              >
                {
                  Object.values(STEPPER_STEPS).find((s) => s.step === step)
                    ?.label
                }
              </span>

              {step < 4 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${isCompleted ? "bg-[#15803D]" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        className="p-7.5 bg-white rounded-[15px] mb-20"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        {renderStepComponent()}
      </div>

      <StepperFooter
        currentStep={currentStep}
        onBack={goBack}
        onContinue={goNext}
        isSubmitting={isSubmitting}
        disableContinue={
          currentStep === STEPPER_STEPS.CONFIGURE_PRODUCTS.step &&
          !selectedProductVariations.some(
            (item) => item.productVariation !== null
          )
        }
        isEdit={true}
      />
    </>
  );
};

export default EditJourneyStepper;
