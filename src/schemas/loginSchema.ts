import { strongPassword } from "@/lib/utils";
import { z } from "zod";

// Zod validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: strongPassword,
  recaptcha_token: z.string()
});

export type LoginFormValues = z.infer<typeof loginSchema>;
