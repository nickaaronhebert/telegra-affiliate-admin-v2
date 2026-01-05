import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { journeySchema } from "@/schemas/journeySchema";
import type { ProductVariationItem } from "@/types/global/productVariationData";
import type { Questionnaire } from "@/types/responses/questionnaire";
import ConfigureProducts from "./ConfigureProducts";
import ConfigureQuestionnaire from "./ConfigureQuestionnaire";
import FinalReviewStep from "./FinalReviewStep";
import ThemeSelection from "./ThemeSelection";
import TickSVG from "@/assets/icons/Tick";
import { STEPPER_STEPS } from "./constants";
import StepperFooter from "./StepperFooter";

interface QuestionnaireItem {
  id: string;
  questionnaire: Questionnaire | null;
}

interface JourneyStepperProps {
  form: ReturnType<typeof useForm<z.infer<typeof journeySchema>>>;
  onSubmit: (values: z.infer<typeof journeySchema>) => void;
  isSubmitting?: boolean;
}

const JourneyStepper = ({
  form,
  onSubmit,
  isSubmitting,
}: JourneyStepperProps) => {
  const [currentStepperStep, setCurrentStepperStep] = useState<number>(
    STEPPER_STEPS.CONFIGURE_PRODUCTS.step
  );
  const [selectedProductVariations, setSelectedProductVariations] = useState<
    ProductVariationItem[]
  >([]);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<{
    pre: QuestionnaireItem[];
    post: QuestionnaireItem[];
  }>({
    pre: [],
    post: [],
  });

  const handleSaveAndContinue = (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      if (currentStepperStep === STEPPER_STEPS.CONFIGURE_PRODUCTS.step) {
        const validProductVariations = selectedProductVariations.filter(
          (item) => item.productVariation !== null
        );
        if (validProductVariations.length > 0) {
          const formattedProducts = validProductVariations.map((item) => ({
            productVariation: item.productVariation!.id,
            quantity: item.quantity,
            pricePerUnitOverride: item.pricePerUnitOverride,
            billingCycleLength: item.billingCycleLength,
          }));
          form.setValue("productVariations", formattedProducts);
          setCurrentStepperStep(STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step);
        }
      } else if (
        currentStepperStep === STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step
      ) {
        // const validQuestionnaires = selectedQuestionnaires
        //   .filter((item) => item.questionnaire !== null)
        //   .map((item) => ({
        //     questionnaire: item.questionnaire!.id,
        //     isPreAuthQuestionnaire: true,
        //   }));
        // form.setValue("preCheckoutQuestionnaire", validQuestionnaires);
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

        setCurrentStepperStep(STEPPER_STEPS.THEME_SELECTION.step);
      } else if (currentStepperStep === STEPPER_STEPS.THEME_SELECTION.step) {
        setCurrentStepperStep(STEPPER_STEPS.FINAL_REVIEW.step);
      } else {
        const validProductVariations = selectedProductVariations
          .filter((item) => item.productVariation !== null)
          .map((item) => ({
            productVariation: item.productVariation!.id,
            quantity: item.quantity,
            pricePerUnitOverride: item.pricePerUnitOverride,
            billingCycleLength: item.billingCycleLength,
          }));

        // const validQuestionnaires = selectedQuestionnaires
        //   .filter((item) => item.questionnaire !== null)
        //   .map((item) => ({
        //     questionnaire: item.questionnaire!.id,
        //     isPreAuthQuestionnaire: true,
        //   }));
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

        form.setValue("productVariations", validProductVariations);
        form.setValue("preCheckoutQuestionnaire", [...validPre, ...validPost]);

        const formValues = form.getValues();
        onSubmit(formValues);
      }
    } catch (error) {
      console.error("Error in handleSaveAndContinue:", error);
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentStepperStep === STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step) {
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

      // setCurrentStepperStep(STEPPER_STEPS.THEME_SELECTION.step);
      setCurrentStepperStep(STEPPER_STEPS.CONFIGURE_PRODUCTS.step);
    } else if (currentStepperStep === STEPPER_STEPS.THEME_SELECTION.step) {
      setCurrentStepperStep(STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step);
    } else if (currentStepperStep === STEPPER_STEPS.FINAL_REVIEW.step) {
      setCurrentStepperStep(STEPPER_STEPS.THEME_SELECTION.step);
    }
  };

  const renderStepperHeader = () => (
    <div
      className="flex items-center justify-center mb-4 rounded-[15px] bg-white p-4"
      style={{
        boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
      }}
    >
      {[1, 2, 3, 4].map((step) => {
        const isCompleted = step < currentStepperStep;
        const isCurrent = step === currentStepperStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted
                  ? "text-white "
                  : isCurrent
                  ? "text-white bg-red"
                  : "bg-gray-200 text-gray-500"
              }`}
              style={{
                background: isCompleted
                  ? "#DCFCE7"
                  : isCurrent
                  ? "var(--primary)"
                  : undefined,
              }}
            >
              {isCompleted ? <TickSVG /> : step}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                isCompleted
                  ? "text-[#15803D]"
                  : isCurrent
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              {step === STEPPER_STEPS.CONFIGURE_PRODUCTS.step &&
                STEPPER_STEPS.CONFIGURE_PRODUCTS.label}
              {step === STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step &&
                STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.label}
              {step === STEPPER_STEPS.THEME_SELECTION.step &&
                STEPPER_STEPS.THEME_SELECTION.label}
              {step === STEPPER_STEPS.FINAL_REVIEW.step &&
                STEPPER_STEPS.FINAL_REVIEW.label}
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
  );

  const renderConfigureProducts = () => (
    <>
      <ConfigureProducts
        selectedProductVariations={selectedProductVariations}
        onProductVariationsChange={setSelectedProductVariations}
      />
    </>
  );

  const renderConfigureQuestionnaire = () => (
    <>
      <ConfigureQuestionnaire
        selectedProductVariations={selectedProductVariations}
        selectedQuestionnaires={selectedQuestionnaires}
        onQuestionnaireSelect={setSelectedQuestionnaires}
      />
    </>
  );

  const renderThemeSelection = () => (
    <ThemeSelection 
      onBack={handleBack} 
      onContinue={handleSaveAndContinue}
      currentTheme={form.getValues("theme")}
      onThemeChange={(theme) => form.setValue("theme", theme)}
    />
  );

  const renderFinalReview = () => (
    <FinalReviewStep
      journeyName={form.getValues("name") || ""}
      selectedProductVariations={selectedProductVariations}
      selectedQuestionnaires={selectedQuestionnaires}
    />
  );

  const renderCurrentStep = () => {
    switch (currentStepperStep) {
      case STEPPER_STEPS.CONFIGURE_PRODUCTS.step:
        return renderConfigureProducts();
      case STEPPER_STEPS.CONFIGURE_QUESTIONNAIRE.step:
        return renderConfigureQuestionnaire();
      case STEPPER_STEPS.THEME_SELECTION.step:
        return renderThemeSelection();
      case STEPPER_STEPS.FINAL_REVIEW.step:
        return renderFinalReview();
      default:
        return renderConfigureProducts();
    }
  };

  return (
    <>
      {renderStepperHeader()}
      <div
        className="p-7.5 bg-white rounded-[15px] mb-20"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        {renderCurrentStep()}
      </div>
          <StepperFooter
      currentStep={currentStepperStep}
      onBack={handleBack}
      onContinue={handleSaveAndContinue}
      isSubmitting={isSubmitting}
      disableContinue={
        currentStepperStep === STEPPER_STEPS.CONFIGURE_PRODUCTS.step &&
        !selectedProductVariations.some(
          (item) => item.productVariation !== null
        )
      }
    />
    </>
  );
};

export default JourneyStepper;
