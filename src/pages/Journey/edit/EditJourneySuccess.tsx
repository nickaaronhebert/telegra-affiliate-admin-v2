import Check from "@/assets/icons/Check";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface EditJourneySuccessProps {
  onEditAnother: () => void;
}

const EditJourneySuccess = ({ onEditAnother }: EditJourneySuccessProps) => {
  const content = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <Check />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Journey successfully updated!
          </h2>
          <p className="text-sm text-gray-600">Changes have been saved</p>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onEditAnother}
            variant="outline"
            className="rounded-full min-h-[48px] px-8 text-[14px] font-semibold cursor-pointer"
          >
            Edit Another Journey
          </Button>
          
          <Link to={ROUTES.JOURNEYS_PATH}>
            <Button
              type="button"
              className="rounded-full min-h-[48px] px-8 text-[14px] font-semibold text-white cursor-pointer"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Back to Journeys
            </Button>
          </Link>
        </div>
      </div>
    ),
    [onEditAnother]
  );

  return content;
};

export default EditJourneySuccess;