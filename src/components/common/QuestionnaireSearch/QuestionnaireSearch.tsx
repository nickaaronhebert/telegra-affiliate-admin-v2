import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetQuestionnairesQuery } from "@/redux/services/questionnaire";
import type { Questionnaire } from "@/types/responses/questionnaire";

interface QuestionnaireItem {
  id: string;
  questionnaire: Questionnaire | null;
}

interface QuestionnaireSearchProps {
  selectedData?: QuestionnaireItem[];
  onSelect: (data: QuestionnaireItem[]) => void;
  label?: string;
}

export function QuestionnaireSearch({
  selectedData,
  onSelect,
  label = "Questionnaires",
}: QuestionnaireSearchProps) {
  const [questionnaireItems, setQuestionnaireItems] = useState<
    QuestionnaireItem[]
  >(selectedData || []);

  useEffect(() => {
    if (selectedData) {
      setQuestionnaireItems(selectedData);
    }
  }, [selectedData]);

  // Notify parent of changes
  useEffect(() => {
    onSelect(questionnaireItems);
  }, [questionnaireItems, onSelect]);

  const { data: questionnaires, isFetching } = useGetQuestionnairesQuery(
    {
      page: 1,
      limit: 100,
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          data: data || [],
          isFetching: isFetching,
        };
      },
    }
  );

  const selectedQuestionnaires = questionnaireItems.filter(
    (item) => item.questionnaire !== null
  );
  const availableQuestionnaires =
    questionnaires?.filter(
      (q) =>
        !selectedQuestionnaires.some((item) => item.questionnaire?.id === q.id)
    ) || [];

  const handleAddQuestionnaire = (questionnaireId: string) => {
    const selected = questionnaires?.find((q) => q.id === questionnaireId);
    if (selected) {
      const newItem: QuestionnaireItem = {
        id: crypto.randomUUID(),
        questionnaire: selected,
      };
      setQuestionnaireItems([...questionnaireItems, newItem]);
    }
  };

  const handleRemoveQuestionnaire = (itemId: string) => {
    setQuestionnaireItems(
      questionnaireItems.filter((item) => item.id !== itemId)
    );
  };

  return (
    <div className="space-y-4">
      {/* Questionnaire Dropdown */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">{label}</Label>
        <Select value="" onValueChange={handleAddQuestionnaire}>
          <SelectTrigger className="w-full pointer">
            <SelectValue
              placeholder={
                isFetching ? "Loading..." : "Choose Question template"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableQuestionnaires.map((questionnaire) => (
              <SelectItem key={questionnaire.id} value={questionnaire.id}>
                <div className="flex flex-col pointer">
                  <span className="font-medium">{questionnaire.title}</span>
                  <span className="text-xs text-gray-500">
                    {questionnaire.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Questionnaires Tags */}
      {selectedQuestionnaires.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedQuestionnaires.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              <span>{item.questionnaire?.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveQuestionnaire(item.id)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
