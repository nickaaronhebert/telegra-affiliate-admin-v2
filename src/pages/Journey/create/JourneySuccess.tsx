import Check from "@/assets/icons/Check";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface JourneySuccessProps {
  onCreateAnother: () => void;
}

const JourneySuccess = ({ onCreateAnother }: JourneySuccessProps) => {
  const content = useMemo(
    () => (
      <div
        className="flex flex-col items-center justify-center py-16 px-8 bg-white rounded-[15px]"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <Check />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Journey successfully published!
          </h2>
          <p className="text-sm text-gray-600">Patient can access it</p>
        </div>

        <Button
          type="button"
          onClick={onCreateAnother}
          className="rounded-full min-h-[48px] px-8 text-[14px] font-semibold text-white cursor-pointer"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Create Another Journey
        </Button>
      </div>
    ),
    [onCreateAnother]
  );

  return content;
};

export default JourneySuccess;
