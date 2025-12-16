import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
      const pv = item?.productVariation;
      if (!pv?.id || !pv?.name) return null;

      return {
        id: item.id ?? crypto.randomUUID(),
        productVariation: {
          id: pv.id,
          name: pv.name,
          ecommercePlatform: pv.ecommercePlatform ?? "",
          ecommerceVariationId: pv.ecommerceVariationId,
          productType: pv.productType ?? "",
          regularPrice: pv.regularPrice ?? 0,
          subscriptionPeriod: pv.subscriptionPeriod,
          subscriptionPeriodInterval: pv.subscriptionPeriodInterval,
          isMapped: pv.isMapped ?? true,
          mappedProductVariation: pv.mappedProductVariation ?? {
            id: "",
            name: "",
          },
          systemMappingId: pv.systemMappingId ?? "",
        } as ProductVariationMapping,
        quantity: item.quantity ?? 1,
        pricePerUnitOverride: item.pricePerUnitOverride ?? pv.regularPrice ?? 0,
        billingCycleLength: item.billingCycleLength ?? 0,
      } as ProductVariationItem;
    })
    .filter((item): item is ProductVariationItem => item !== null);

const toQuestionnaireItems = (source: any[]): QuestionnaireItem[] =>
  source
    .map((q, index) => {
      if (!q?.questionnaire) return null;

      return {
        id: `questionnaire-${index}`,
        questionnaire: {
          id:
            typeof q.questionnaire === "object"
              ? q.questionnaire.id
              : q.questionnaire,
          name: q.questionnaire?.name ?? "",
          title: q.questionnaire?.title ?? "",
          active: q.questionnaire?.active ?? true,
          createdAt: q.questionnaire?.createdAt ?? "",
          updatedAt: q.questionnaire?.updatedAt ?? "",
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
    if (currentStep < STEPPER_STEPS.FINAL_REVIEW.step)
      return setCurrentStep(currentStep + 1);

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

    onSubmit(form.getValues());
  };

  const goBack = () => {
    if (currentStep > STEPPER_STEPS.CONFIGURE_PRODUCTS.step)
      setCurrentStep(currentStep - 1);
  };

  /* ---------- Renderers ---------- */

  const renderConfigureProducts = () => {
    const valid = selectedProductVariations.filter(
      (i) => i.productVariation?.name
    );

    return (
      <div className="bg-white p-6 rounded-[15px] mx-auto box shadow-md">
        {valid.length === 0 ? (
          <div className="text-center text-gray-500 mt-6 mb-6">
            No product variations found.
          </div>
        ) : (
          <ConfigureProducts
            selectedProductVariations={valid}
            onProductVariationsChange={setSelectedProductVariations}
          />
        )}

        <div className="flex justify-end mt-6 items-center gap-2.5">
          <Button
            type="button"
            onClick={() => {
              form.setValue(
                "productVariations",
                valid
                  .filter((item) => item.productVariation?.id)
                  .map((item) => ({
                    productVariation: item.productVariation!.id,
                    quantity: item.quantity,
                    pricePerUnitOverride: item.pricePerUnitOverride,
                    billingCycleLength: item.billingCycleLength,
                  }))
              );
              goNext();
            }}
            disabled={valid.length === 0}
            className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold text-white mt-6"
          >
            Save & Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderConfigureQuestionnaire = () => (
    <>
      <ConfigureQuestionnaire
        selectedProductVariations={selectedProductVariations}
        selectedQuestionnaires={selectedQuestionnaires}
        onQuestionnaireSelect={setSelectedQuestionnaires}
      />

      <div className="flex justify-between items-center mt-6 gap-2.5 border-t border-dashed border-gray-300">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          className="rounded-full min-w-[130px]"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={goNext}
          className="rounded-full min-w-[130px] text-white"
        >
          Save & Continue
        </Button>
      </div>
    </>
  );

  const renderStepComponent = () => {
    switch (currentStep) {
      case STEPPER_STEPS.CONFIGURE_PRODUCTS.step:
        return renderConfigureProducts();
      case STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step:
        return renderConfigureQuestionnaire();
      case STEPPER_STEPS.THEME_SELECTION.step:
        return <ThemeSelection onBack={goBack} onContinue={goNext} />;
      case STEPPER_STEPS.FINAL_REVIEW.step:
        return (
          <FinalReviewStep
            journeyName={form.getValues("name") || ""}
            selectedProductVariations={selectedProductVariations}
            selectedQuestionnaires={selectedQuestionnaires}
            onBack={goBack}
            onSubmit={goNext}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Stepper Header */}
      <div className="flex items-center justify-center mb-4 bg-white p-4 rounded-[15px] shadow-md">
        {[1, 2, 3, 4].map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted
                    ? "bg-[#DCFCE7] text-white"
                    : isCurrent
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <TickSVG /> : step}
              </div>

              <span
                className={`ml-2 text-sm font-medium ${
                  isCurrent ? "text-primary" : ""
                }`}
              >
                {
                  Object.values(STEPPER_STEPS).find((s) => s.step === step)
                    ?.label
                }
              </span>

              {step < 4 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    isCompleted ? "bg-[#15803D]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {renderStepComponent()}
    </>
  );
};

export default EditJourneyStepper;
