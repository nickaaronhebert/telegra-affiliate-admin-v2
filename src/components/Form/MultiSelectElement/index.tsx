import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";

interface Props {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  type?: string;
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  className?: string;
  messageClassName?: string;
}

const MultiSelectElement = ({
  name,
  label,
  description,
  placeholder,
  options,
  //   disabled = false,
  isRequired = false,
  className = "",
  messageClassName = "",
}: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("", className)}>
            {label && (
              <FormLabel>
                {label}
                {isRequired && (
                  <span className="text-destructive font-semibold">*</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <MultiSelect
                options={options}
                onValueChange={field.onChange}
                defaultValue={field.value}
                placeholder={placeholder}
                variant="inverted"
                animation={2}
                maxCount={2}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className={cn("", messageClassName)} />
          </FormItem>
        );
      }}
    />
  );
};

export default MultiSelectElement;
