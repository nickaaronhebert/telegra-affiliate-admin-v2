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
    <div>
      <Form {...form}>
        <form
          className="mx-auto pb-32 bg-white p-8 rounded-[15px]"
          style={{
            boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            const nameValue = form.getValues("name");
            if (nameValue && nameValue.trim() !== "") {
              onNext(form.getValues());
            }
          }}
        >
          <div className="">
            <div className="flex flex-col mb-6">
              <span className="text-2xl font-semibold">
                Edit journey details
              </span>
              <span className="text-base text-[#63627F]">
                Update the journey name. These changes will reflect publicly.
              </span>
            </div>
            <div className="w-[60%] space-y-6 mx-auto">
              <BuiltInGuardrails />
              <div>
                <InputElement
                  name="name"
                  label="Journey Name"
                  placeholder="Eg. Weight loss journey"
                  disabled
                  className="cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* FIXED FOOTER */}
          <div className="fixed bottom-0 left-0 right-0 bg-white px-8 py-6 flex justify-end gap-2.5">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px]"
              >
                Back
              </Button>
            )}

            <Button
              type="submit"
              disabled={!form.watch("name") || form.watch("name").trim() === ""}
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
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
