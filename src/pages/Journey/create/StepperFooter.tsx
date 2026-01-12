import { Button } from "@/components/ui/button";
import { STEPPER_STEPS } from "./constants";

interface StepperFooterProps {
  currentStep: number;
  onBack: () => void;
  onContinue: () => void;
  isSubmitting?: boolean;
  disableContinue?: boolean;
  isEdit?: boolean;
}

const StepperFooter = ({
  currentStep,
  onBack,
  onContinue,
  isSubmitting,
  disableContinue,
  isEdit = false,
}: StepperFooterProps) => {
  const getButtonText = () => {
    if (currentStep === STEPPER_STEPS.FINAL_REVIEW.step) {
      return isEdit ? "Update Journey" : "Publish";
    }
    return "Save & Continue";
  };

  return (
    <div className="fixed w-full bottom-0 right-0 bg-white px-8 py-4 flex justify-end items-right gap-4 ">
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold pointer"
        >
          Back
        </Button>
      )}

      <Button
        onClick={onContinue}
        disabled={disableContinue || isSubmitting}
        className="rounded-full min-h-[48px] min-w-[160px] text-[14px] font-semibold text-white disabled:opacity-50 pointer"
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default StepperFooter;
