import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        active:
          "border-transparent bg-[#DCFCE7] text-[#15803D] [a&]:hover:bg-green-200",
        draft:
          "border-transparent bg-[#F4F4F4] text-[#000000] [a&]:hover:bg-red-200",
        expired:
          "border-transparent bg-[#FFE5E5] text-[#C41E3A] [a&]:hover:bg-gray-300",
        disabled :
          "border-transparent bg-[#FEF9C3] text-[#854D0E] [a&]:hover:bg-gray-200",
        pending :
          "border-transparent bg-[#FEF9C3] text-[#854D0E] [a&]:hover:bg-gray-200",
        pendingCancel:
          "border-transparent bg-[#FFE5E5] text-[#C41E3A] [a&]:hover:bg-gray-300",
        onHold:
          "border-transparent bg-[#CCE5FF] text-[#004085] [a&]:hover:bg-yellow-300",
        oneTime :
          "border-transparent bg-[#CCE5FF] text-[#004085] [a&]:hover:bg-gray-200",
        subscriptionFixed:
          "border-transparent bg-[#FEF9C3] text-[#854D0E] [a&]:hover:bg-gray-300",
        subscriptionVariable:
          "border-transparent bg-[#F3E8FF] text-[#5456AD] [a&]:hover:bg-yellow-300",
        user:
          "border-transparent bg-[#DCFCE7] text-[#15803D] [a&]:hover:bg-green-200",
        affiliate:
          "border-transparent bg-[#FEF9C3] text-[#854D0E] [a&]:hover:bg-gray-300",
        patient:
          "border-transparent bg-[#DCFCE7] text-[#15803D] [a&]:hover:bg-green-200 text-[10px]",
        defaultSecondary:
          "border-transparent bg-[#F4F4F4] text-[#3E4D61] [a&]:hover:bg-red-200 text-[10px]",

      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
