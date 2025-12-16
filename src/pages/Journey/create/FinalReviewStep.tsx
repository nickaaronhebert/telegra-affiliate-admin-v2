import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
import type { ProductVariationItem } from "@/types/global/productVariationData";
import type { Questionnaire } from "@/types/responses/questionnaire";
import { STEPPER_STEPS, PATIENT_JOURNEY_FLOW } from "./constants";

interface QuestionnaireItem {
  id: string;
  questionnaire: Questionnaire | null;
}

interface FinalReviewStepProps {
  journeyName: string;
  selectedProductVariations: ProductVariationItem[];
  selectedQuestionnaires: {
    pre: QuestionnaireItem[];
    post: QuestionnaireItem[];
  };
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const FinalReviewStep = ({
  journeyName,
  selectedProductVariations,
  selectedQuestionnaires,
  onBack,
  onSubmit,
  isSubmitting,
}: FinalReviewStepProps) => {
  const validProducts = selectedProductVariations.filter(
    (item) => item.productVariation !== null
  );
  const validPre = selectedQuestionnaires.pre.filter(
    (item) => item.questionnaire !== null
  );

  const validPost = selectedQuestionnaires.post.filter(
    (item) => item.questionnaire !== null
  );

  return (
    <>
      <div className="flex flex-col mb-6">
        <span className="text-lg font-semibold">Review & Publish</span>
        <span className="text-base text-[#63627F]">
          Review your journey configuration before publishing.
        </span>
      </div>

      <div className=" space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-gray-600">Journey Name</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {journeyName}
              </h3>
            </div>
            <div>
              <span className="text-sm text-gray-600">Theme</span>
              <h3 className="text-lg font-semibold text-gray-900">
                Guided Cards
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-gray-600">Total Steps</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {Object.keys(STEPPER_STEPS).length}
              </h3>
            </div>
            <div>
              <span className="text-sm text-gray-600">Products Configured</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {validProducts.length}
              </h3>
            </div>
          </div>
        </div>

        {/* <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            Pre-Purchase Questionnaires ({validQuestionnaires.length})
          </h4>
          <div className="space-y-2">
            {validQuestionnaires.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: "hsl(var(--primary))" }}
                  >
                    {item.questionnaire?.title?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.questionnaire?.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* PRE Purchase */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            Pre-Purchase Questionnaires ({validPre.length})
          </h4>

          <div className="space-y-2">
            {validPre.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white border rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: "hsl(var(--primary))" }}
                  >
                    {item.questionnaire?.title?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.questionnaire?.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POST Purchase */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            Post-Purchase Questionnaires ({validPost.length})
          </h4>

          <div className="space-y-2">
            {validPost.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white border rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: "hsl(var(--primary))" }}
                  >
                    {item.questionnaire?.title?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.questionnaire?.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            Patient Journey Flow
          </h4>
          <div className="flex items-center gap-3 p-4">
            {PATIENT_JOURNEY_FLOW.map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className="flex items-center gap-2 rounded-lg pl-4 pr-4 pt-2 pb-2"
                  style={{ backgroundColor: "var(--color-yellow-light)" }}
                >
                  <div
                    className="w-2 h-2 rounded flex items-center justify-center text-sm font-medium"
                    style={{ color: "var(--color-yellow-dark)" }}
                  >
                    {item.step}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-yellow-dark)" }}
                  >
                    {item.title}
                  </span>
                </div>
                {index < PATIENT_JOURNEY_FLOW.length - 1 && (
                  <div
                    className="w-6 h-0.5 mx-3"
                    style={{ backgroundColor: "var(--color-yellow-dark)" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ready to Publish */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-medium text-green-800">
                Journey is ready to publish
              </h5>
              <p className="text-sm text-green-700 mt-1">
                All required configurations are complete and all guardrails are
                satisfied.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 gap-2.5 border-t border-dashed border-gray-300">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold mt-6 cursor-pointer"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold text-white mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : "Publish Journey"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FinalReviewStep;
