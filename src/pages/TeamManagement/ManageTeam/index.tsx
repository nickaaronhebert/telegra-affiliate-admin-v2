import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CenteredRow } from "@/components/ui/centered-row";
import { teamManagementSchema } from "@/schemas/teamManagementSchema";
import InputElement from "@/components/Form/InputElement";
import SelectElement from "@/components/Form/SelectElement";
import { toast } from "sonner";

interface ManageTeamProps {
  action: any;
  successMessage: string;
  isLoading: boolean;
  setClose: (arg: boolean) => void;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  id?: string;
  confirmText: string;
}

const roles = [
  {
    label: "Admin",
    value: "affiliate-admin",
  },
  {
    label: "Super Admin",
    value: "affiliate-super-admin",
  },
  {
    label: "Agent",
    value: "affiliate-agent",
  },
];

export default function ManageTeam({
  action,
  successMessage,
  confirmText,
  isLoading,
  setClose,
  firstName = "",
  lastName = "",
  email = "",
  phone = "",
  role = "",
  id,
}: ManageTeamProps) {
  const form = useForm<z.infer<typeof teamManagementSchema>>({
    mode: "onChange",
    resolver: zodResolver(teamManagementSchema),
    defaultValues: {
      firstName,
      lastName,
      email,
      phone,
      role,
    },
  });

  async function onSubmit(data: z.infer<typeof teamManagementSchema>) {
    const payload = id
      ? {
          ...data,
          id,
        }
      : {
          ...data,
        };
    await action(payload)
      .unwrap()
      .then(() => {
        toast.success(successMessage, {
          duration: 1500,
        });
        setClose(false);
      })
      .catch((err: any) => {
        console.log("err", err);
        toast.error("Something went wrong", {
          duration: 1500,
        });
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col  mt-6 "
        >
          <CenteredRow>
            <InputElement
              name="firstName"
              className="w-1/2"
              label="First Name"
              placeholder="Eg. John"
              isRequired={true}
              messageClassName="text-right"
              inputClassName="border border-[#9EA5AB] min-h-11.5 placeholder:text-[#C3C1C6]"
              reserveSpace={true}
            />

            <InputElement
              name="lastName"
              className="w-1/2 "
              placeholder="Eg. Smith"
              label="Last Name"
              isRequired={true}
              messageClassName="text-right"
              inputClassName="border border-[#9EA5AB] min-h-11.5 placeholder:text-[#C3C1C6]"
              reserveSpace={true}
            />
          </CenteredRow>

          <InputElement
            name="email"
            label="Email"
            isRequired={true}
            messageClassName="text-right"
            placeholder="john@yopmail.com"
            inputClassName="border border-[#9EA5AB] min-h-11.5 placeholder:text-[#C3C1C6]"
            reserveSpace={true}
          />

          <CenteredRow>
            <InputElement
              name="phone"
              className="w-1/2"
              label="Phone Number"
              isRequired={true}
              placeholder="(123)-456-7890"
              messageClassName="text-right"
              inputClassName="min-h-11.5 border border-[#9EA5AB] placeholder:text-[#C3C1C6]"
              reserveSpace={true}
            />

            <SelectElement
              name="role"
              className="min-w-50 min-h-11.5 "
              options={roles || []}
              label="Role"
              isRequired={true}
              placeholder="Eg. Admin"
              triggerClassName="border border-[#9EA5AB] placeholder:text-[#C3C1C6]"
              reserveSpace={true}
              errorClassName="text-right"
            />
          </CenteredRow>

          <div className="flex justify-end mt-6 gap-2">
            <Button
              //   disabled={!form.formState.isValid}
              onClick={() => setClose(false)}
              type="button"
              variant={"outline"}
              className="cursor-pointer rounded-[50px] p-0! min-w-37.5 min-h-14 text-black font-semibold "
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              className="cursor-pointer text-white rounded-full p-0! min-w-37.5 min-h-14 text-base font-semibold"
            >
              {confirmText}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
