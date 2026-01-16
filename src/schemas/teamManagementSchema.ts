import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .min(1, { message: "Phone number is required." })
  .refine(
    (val) => {
      // remove non-digit characters
      const digits = val.replace(/\D/g, "");
      return digits.length === 10;
    },
    {
      message: "Phone number must be 10 digits.",
    }
  );

export const teamManagementSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  phone: phoneNumberSchema,
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
});
