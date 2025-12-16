import { z } from "zod";
import { strongPassword } from "@/lib/utils";

// Zod validation schema for reset password
export const resetPasswordSchema = z.object({
  access_token: z.string().min(1, { message: "Access token is required" }),
  password: strongPassword,
  passwordConfirm: strongPassword,
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;