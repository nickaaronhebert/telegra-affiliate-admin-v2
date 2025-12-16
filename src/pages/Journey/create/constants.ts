export const STEPPER_STEPS = {
  CONFIGURE_PRODUCTS: { step: 1, label: "Configure Products" },
  CONFIGURE_QUESTIONNAIRE: { step: 2, label: "Configure Questionnaire" },
  THEME_SELECTION: { step: 3, label: "Theme Selection" },
  FINAL_REVIEW: { step: 4, label: "Final Review" },
} as const;

export const PATIENT_JOURNEY_FLOW = [
  { step: 1, title: "Questionnaire" },
  { step: 2, title: "Cart" },
  { step: 3, title: "Authentication" },
  { step: 4, title: "Payment" }
] as const;