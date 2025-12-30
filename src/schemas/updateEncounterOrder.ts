import { z } from "zod";

export const encounterProductVariation = z.object({
  productVariation: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number({
      message: "Invalid Number",
    })
    .int("Invalid Number")
    .positive("Invalid Number"),
});

export const updateEncounterOrder = z.object({
  address1: z.string().min(3, { message: "Address Line 1 is required." }),
  address2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipcode: z.string().min(3, { message: "Zip code is required." }),
  project: z.string().optional(),
  paymentCard: z.string().optional(),
});
