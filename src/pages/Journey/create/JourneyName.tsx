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
    <div
      className="bg-white p-8 rounded-[15px]"
      style={{
        boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
      }}
    >
      <div className="flex flex-col mb-6">
        <span className="text-lg font-semibold ">
          Customize your checkout process
        </span>
        <span className="text-base text-[#63627F]">
          An online visit will be required if the patient needs to complete
          additional questionnaires after purchase.
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
              onSubmit(form.getValues());
            }
          }}
        >
          <div>
            <InputElement
              name="name"
              label="Journey Name"
              placeholder="Eg.Weight loss journey"
            />
          </div>
          <div className="flex justify-end mt-6 items-center gap-2.5">
            <Button
              type="submit"
              disabled={!form.watch("name") || form.watch("name").trim() === ""}
              className="rounded-full min-h-[48px] min-w-[130px] text-[14px] font-semibold text-white mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
