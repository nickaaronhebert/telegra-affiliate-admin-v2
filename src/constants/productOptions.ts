import { z } from "zod";
import { PRODUCT_TYPES } from "@/constants";

// Product type options
export const PRODUCT_TYPE_OPTIONS = [
  { label: "One Time", value: PRODUCT_TYPES.ONE_TIME },
  { label: "Subscription Fixed", value: PRODUCT_TYPES.SUBSCRIPTION_FIXED },
  {
    label: "Subscription Variable",
    value: PRODUCT_TYPES.SUBSCRIPTION_VARIABLE,
  },
];

// Subscription period options
export const SUBSCRIPTION_PERIOD_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

// Interval options
export const INTERVAL_OPTIONS = [
  { label: "Every", value: "1" },
  { label: "Every 2nd", value: "2" },
  { label: "Every 3rd", value: "3" },
  { label: "Every 4th", value: "4" },
  { label: "Every 5th", value: "5" },
  { label: "Every 6th", value: "6" },
];

// Generate subscription length options based on interval and period
export const generateSubscriptionLengthOptions = (interval: string, period: string) => {
  const options = [{ label: "Do not stop until cancelled", value: "0" }];

  const intervalNum = parseInt(interval) || 1;
  
  // Determine multiplier, unit, and max limit based on period
  let multiplier = 1;
  let unit = "days";
  let useNaturalUnit = false;
  let maxLimit = 45;
  
  switch (period) {
    case "week":
      multiplier = 1;
      unit = "week";
      useNaturalUnit = true;
      maxLimit = 52;
      break;
    case "month":
      multiplier = 1;
      unit = "month";
      useNaturalUnit = true;
      maxLimit = 24;
      break;
    case "year":
      multiplier = 1;
      unit = "year";
      useNaturalUnit = true;
      maxLimit = 5;
      break;
    case "day":
    default:
      multiplier = 1;
      unit = "days";
      useNaturalUnit = false;
      maxLimit = 45;
  }

  // Generate options and stop when we exceed maxLimit
  for (let i = 1; i <= maxLimit; i++) {
    const total = intervalNum * multiplier * i;
    if (total > maxLimit) break;
    
    const label = useNaturalUnit 
      ? `${total} ${unit}${total > 1 ? 's' : ''}`
      : `${total} ${unit}`;
    
    options.push({
      label,
      value: String(i),
    });
  }

  return options;
};

// Variation schema for SUBSCRIPTION_VARIABLE
export const variationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  regularPrice: z.string().min(1, "Price is required"),
  subscriptionPeriod: z.string().default("month"),
  periodLength: z.string().default("1"),
  subscriptionLength: z.string().default("0"),
});
