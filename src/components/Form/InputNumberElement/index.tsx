import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputElementProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
  isOptional?: boolean;
  isRequired?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  messageClassName?: string;
  isLoginLabel?: boolean;
  reserveSpace?: boolean;
  minValue?: number;
}

const InputNumberElement: React.FC<InputElementProps> = ({
  name,
  label,
  placeholder,
  description,
  isOptional,
  isRequired,
  labelClassName,
  inputClassName,
  messageClassName,
  isLoginLabel,
  minValue = 0,
  reserveSpace = false,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", props.className)}>
          {label && (
            <FormLabel className={cn("", labelClassName)}>
              {label}
              {isOptional && (
                <span className="text-neutral-400"> (optional)</span>
              )}
              {isRequired && (
                <span className="text-destructive font-semibold">*</span>
              )}
              {isLoginLabel && (
                <div className="flex justify-between w-full">
                  <span className="text-destructive font-semibold">*</span>
                  <span className="text-xs text-[#F0956D] font-semibold italic">
                    (Will be used for login)
                  </span>
                </div>
              )}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              className={cn("", inputClassName)}
              type={"number"}
              min={minValue}
              disabled={props.disabled}
              autoComplete={props.autoComplete}
              readOnly={props.readOnly}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage
            className={cn("", messageClassName)}
            reserveSpace={reserveSpace}
          />
        </FormItem>
      )}
    />
  );
};

export default InputNumberElement;
