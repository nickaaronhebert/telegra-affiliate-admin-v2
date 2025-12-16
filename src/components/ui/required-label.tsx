// components/ui/required-label.tsx
import { FormLabel } from "@/components/ui/form";

interface RequiredLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function RequiredLabel({
  children,
  required = false,
  className,
}: RequiredLabelProps) {
  return (
    <FormLabel className={className}>
      {children}
      {required && <span className="text-destructive font-semibold">*</span>}
    </FormLabel>
  );
}
