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
import USAIconSvg from "@/assets/icons/USAIcon";
// import USAIconSvg from "@/assets/icons/USAIcon";

interface PhoneInputElementProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
  isOptional?: boolean;
  isRequired?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  messageClassName?: string;
  reserveSpace?: boolean;
}

const PhoneInputElement: React.FC<PhoneInputElementProps> = ({
  name,
  label,
  placeholder,
  description,
  isOptional,
  isRequired,
  labelClassName,
  inputClassName,
  messageClassName,
  reserveSpace = true,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          // remove all non-digit characters
          let val = e.target.value.replace(/\D/g, "");

          // limit to 10 digits
          if (val.length > 10) val = val.slice(0, 10);

          // format as (XXX) XXX-XXXX
          if (val.length >= 7) {
            val = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
          } else if (val.length >= 4) {
            val = `(${val.slice(0, 3)}) ${val.slice(3)}`;
          } else if (val.length >= 1) {
            val = `(${val}`;
          }
          field.onChange(val);
        };

        return (
          <FormItem className={cn("", props.className)}>
            {label && (
              <FormLabel className={cn("", labelClassName)} htmlFor={name}>
                {label}
                {isOptional && (
                  <span className="text-neutral-400"> (optional)</span>
                )}
                {isRequired && (
                  <span className="text-destructive font-semibold">*</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <div className="flex items-center border border-[#9EA5AB] rounded-[5px] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
                <div className="bg-[#EFEFEFE0] p-4 border-r  border-input h-full flex items-center rounded-tl-[5px] rounded-bl-[5px]">
                  <USAIconSvg />
                </div>

                <Input
                  {...field}
                  id={name}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={cn("border-none!", inputClassName)}
                  type={props.type || "text"}
                  disabled={props.disabled}
                  // autoComplete={props.autoComplete}
                  readOnly={props.readOnly}
                />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}

            <FormMessage
              className={cn("", messageClassName)}
              reserveSpace={true}
            />
          </FormItem>
        );
      }}
    />
  );
};

export default PhoneInputElement;
