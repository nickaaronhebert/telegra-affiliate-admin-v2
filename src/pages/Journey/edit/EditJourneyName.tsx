import BuiltInGuardrails from "../create/BuiltInGuardrails";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { journeySchema } from "@/schemas/journeySchema";
import InputElement from "@/components/Form/InputElement";
import { Button } from "@/components/ui/button";

interface EditJourneyNameProps {
  form: ReturnType<typeof useForm<z.infer<typeof journeySchema>>>;
  onNext: (values: z.infer<typeof journeySchema>) => void;
  onBack?: () => void; // optional for edit
}

const EditJourneyName = ({ form, onNext, onBack }: EditJourneyNameProps) => {
  return (
    <div className="bg-white p-6 rounded-[15px] mx-auto box shadow-md">
      <div className="flex flex-col mb-6">
        <span className="text-lg font-semibold">Edit journey details</span>
        <span className="text-base text-[#63627F]">
          Update the journey name. These changes will reflect publicly.
        </span>
      </div>

      <BuiltInGuardrails />

      <Form {...form}>
        <form
          className="w-[60%] mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            const nameValue = form.getValues("name");
            if (nameValue && nameValue.trim() !== "") {
              onNext(form.getValues());
            }
          }}
        >
          <div>
            <InputElement
              name="name"
              label="Journey Name"
              placeholder="Eg. Weight loss journey"
              disabled
              className="cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end mt-6 items-center gap-2.5 pt-6">
            {/* BACK BUTTON (optional) */}
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-medium"
              >
                Back
              </Button>
            )}

            <Button
              type="submit"
              disabled={!form.watch("name") || form.watch("name").trim() === ""}
              className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditJourneyName;
