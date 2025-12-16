import { z } from "zod";

// Zod validation schema
export const selectPatientSchema = z.object({
  patient: z.string().min(1, { message: "Patient is required" }),
  // .email({ message: "Please enter a valid email address" }),
});

// export type LoginFormValues = z.infer<typeof loginSchema>;
