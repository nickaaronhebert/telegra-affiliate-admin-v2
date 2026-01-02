import BuiltInGuardrails from "./BuiltInGuardrails";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { journeySchema } from "@/schemas/journeySchema";
import InputElement from "@/components/Form/InputElement";
import { Button } from "@/components/ui/button";

interface JourneyNameProps {
  form: ReturnType<typeof useForm<z.infer<typeof journeySchema>>>;
  onSubmit: (values: z.infer<typeof journeySchema>) => void;
}

const JourneyName = ({ form, onSubmit }: JourneyNameProps) => {
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
              onSubmit(form.getValues());
            }
          }}
        >
          <div className="" >
            <div className="flex flex-col mb-6">
              <span className="text-2xl font-semibold ">
                Customize your checkout process
              </span>
              <span className="text-base text-[#63627F]">
                An online visit will be required if the patient needs to complete
                additional questionnaires after purchase.
              </span>
            </div>
            <div className="w-[60%] space-y-6 mx-auto">
              <BuiltInGuardrails />
              <div>
                <InputElement
                  name="name"
                  label="Journey Name"
                  placeholder="Eg. Weight loss journey"
                />
              </div>
            </div>
          </div>

          {/* FIXED FOOTER */}
          <div className="fixed bottom-0 left-0 right-0 bg-white px-8 py-6 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                const nameValue = form.getValues("name");
                if (nameValue && nameValue.trim() !== "") {
                  onSubmit(form.getValues());
                }
              }}
              disabled={!form.watch("name") || form.watch("name").trim() === ""}
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JourneyName;
