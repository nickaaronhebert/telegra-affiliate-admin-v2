import { z } from "zod";

export const addressSchema = z.object({
  address1: z.string().min(3, { message: "Address Line 1 is required." }),
  address2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipcode: z.string().min(3, { message: "Zip code is required." }),

  country: z.string().min(2, { message: "Country is required." }),
});

export const selectOrderAddressSchema = z
  .object({
    newShippingAddress: z.boolean().optional(),
    newBillingAddress: z.boolean().optional(),
    shippingAddress: addressSchema.partial().optional(),
    billingAddress: addressSchema.partial().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newShippingAddress) {
      // console.log("sip error");
      const parsed = addressSchema.safeParse(data.shippingAddress);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) =>
          ctx.addIssue({
            ...issue,
            path: ["shippingAddress", ...(issue.path || [])],
          })
        );
      }
    }

    if (data.newBillingAddress) {
      // console.log("bill error");
      const parsed = addressSchema.safeParse(data.billingAddress);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) =>
          ctx.addIssue({
            ...issue,
            path: ["billingAddress", ...(issue.path || [])],
          })
        );
      }
    }
  });
