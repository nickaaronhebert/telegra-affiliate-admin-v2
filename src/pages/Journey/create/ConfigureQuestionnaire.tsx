import { Label } from "@/components/ui/label";
import { QuestionnaireSearch } from "@/components/common/QuestionnaireSearch";
import type { ProductVariationItem } from "@/types/global/productVariationData";
import type { Questionnaire } from "@/types/responses/questionnaire";
import { useEffect, useState } from "react";

interface QuestionnaireItem {
  id: string;
  questionnaire: Questionnaire | null;
}

interface ConfigureQuestionnaireProps {
  selectedProductVariations: ProductVariationItem[];
  selectedQuestionnaires?: {
    pre: QuestionnaireItem[];
    post: QuestionnaireItem[];
  };
  onQuestionnaireSelect?: (values: {
    pre: QuestionnaireItem[];
    post: QuestionnaireItem[];
  }) => void;
}

const ConfigureQuestionnaire = ({
  selectedProductVariations,
  selectedQuestionnaires,
  onQuestionnaireSelect,
}: ConfigureQuestionnaireProps) => {
  const validProducts = selectedProductVariations.filter(
    (item) => item.productVariation !== null
  );
  const [preQuestionnaires, setPreQuestionnaires] = useState<
    QuestionnaireItem[]
  >(selectedQuestionnaires?.pre || []);
  const [postQuestionnaires, setPostQuestionnaires] = useState<
    QuestionnaireItem[]
  >(selectedQuestionnaires?.post || []);

  useEffect(() => {
    onQuestionnaireSelect?.({
      pre: preQuestionnaires,
      post: postQuestionnaires,
    });
  }, [preQuestionnaires, postQuestionnaires]);

  return (
    <>
      <div className="flex flex-col">
        <span className="text-2xl font-medium">Configure Questionnaire</span>
        <span className="text-base text-[#63627F]">
          Choose which questionnaire will be used in this journey.
        </span>
      </div>

      <div className="bg-white p-6 space-y-6">
        <div className="space-y-4 p-5 bg-secondary rounded-md">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold text-[#3E4D61]">
              Selected Products:
            </Label>
            <div className="flex gap-2 flex-wrap">
              {validProducts.length > 0 ? (
                validProducts.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center px-3 py-2 rounded-md text-xs font-medium bg-white text-[#3E4D61] border border-card-border"
                    style={{
                      boxShadow: "0px 4px 4px 0px hsla(0, 0%, 0%, 0.08)",
                    }}
                  >
                    {item.productVariation?.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">
                  No products selected
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4 w-[60%] mx-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label className="text-sm font-medium text-gray-900">
                Pre-Purchase Questions
              </Label>
              <span className="text-red-500 text-sm">*</span>
            </div>
            <p className="text-xs text-gray-600">
              (Questionnaire before User Submits their Information)
            </p>
          </div>

          <QuestionnaireSearch
            selectedData={preQuestionnaires}
            // acceptMultiple={true}
            label="Pre-Purchase Questionnaires"
            onSelect={setPreQuestionnaires}
          />
        </div>
        <div className="space-y-4 w-[60%] mx-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label className="text-sm font-medium text-gray-900">
                Post-Purchase Questions
              </Label>
              <span className="text-red-500 text-sm">*</span>
            </div>
            <p className="text-xs text-gray-600">
              Questionnaire after User Submits their information
            </p>
          </div>

          <QuestionnaireSearch
            selectedData={postQuestionnaires}
            label="Post-Purchase Questionnaires"
            onSelect={setPostQuestionnaires}
          />
        </div>
      </div>
    </>
  );
};

export default ConfigureQuestionnaire;
