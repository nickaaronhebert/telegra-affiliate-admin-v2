import { z } from "zod";
import { GENDER_OPTIONS } from "@/constants";

export const createPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  genderBiological: z.enum([GENDER_OPTIONS.MALE.value, GENDER_OPTIONS.FEMALE.value], {
    message: "Please select a biological gender",
  }),
  gender: z.enum([GENDER_OPTIONS.MALE.value, GENDER_OPTIONS.FEMALE.value], {
    message: "Please select an identified gender",
  }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  height: z.number().min(20, "Height must be at least 20 inches").optional(),
  weight: z.number().min(40, "Weight must be at least 40 lbs").optional(),
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
