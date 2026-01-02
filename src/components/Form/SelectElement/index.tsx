import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Search } from "lucide-react";

interface BaseOption {
  label: string;
  value: string;
  [key: string]: any; // Allow additional properties
}

interface SelectElementProps
  extends Omit<React.InputHTMLAttributes<HTMLSelectElement>, "onChange"> {
  name: string;
  label?: string;
  description?: string;
  isOptional?: boolean;
  isRequired?: boolean;
  labelClassName?: string;
  errorClassName?: string;
  placeholder?: string;
  options: BaseOption[];
  triggerClassName?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onHandleClick?: () => void;
  // Keys to display (if not provided, shows only 'label')
  displayKeys?: string[];
  // Separator for concatenating fields
  separator?: string;
  searchValue?: string;
  reserveSpace?: boolean;
  isLoading?: boolean;
  loadingTitle?: string;
}

const SelectElement: React.FC<SelectElementProps> = ({
  name,
  label,
  labelClassName = "",
  placeholder = "",
  description,
  isOptional,
  options,
  isRequired,
  searchValue,
  triggerClassName,
  errorClassName,
  onSearch,
  onChange,
  isLoading = false,
  reserveSpace = false,
  loadingTitle = "Loading your results...",
  displayKeys = ["label"], // Default to showing only label
  separator = " , ",
  ...props
}) => {
  const { control } = useFormContext();

  const getDisplayText = (option: BaseOption): string => {
    const displayValues = displayKeys
      .map((key) => option[key])
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map((value) => String(value));

    return displayValues.join(separator);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", props.className)}>
          {label && (
            <FormLabel className={cn(labelClassName)}>
              {label}
              {isOptional && (
                <span className="text-neutral-400"> (optional)</span>
              )}
              {isRequired && (
                <span className="text-destructive font-semibold">*</span>
              )}
            </FormLabel>
          )}
          <Select
            name={name}
            onValueChange={(value: any) => {
              field.onChange(value); // Always update the form field
              onChange?.(value); // Call custom onChange if provided
              onSearch?.("");
            }}
            value={field.value || ""}
            disabled={props.disabled}
          >
            <FormControl className={cn("bg-white", props.className)}>
              <SelectTrigger
                className={cn("", triggerClassName)}
                ref={field.ref}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {onSearch && (
                <div className="flex items-center px-2 border-b border-gray-200">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="h-8 w-full text-sm outline-none border-0 focus:outline-none placeholder:text-gray-400"
                    onKeyDown={(e) => e.stopPropagation()} // prevent Radix Select hijacking keys
                    onChange={(e) => onSearch(e.target.value)}
                    value={searchValue}
                  />
                </div>

                // <Input
                //   placeholder="Search..."
                //   className="h-[26px] rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                //   onChange={(e) => {
                //     const query = e.target.value;
                //     onSearch(query);
                //   }}
                // />
              )}

              {isLoading ? (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  {loadingTitle || "Loading..."}
                </div>
              ) : options && options.length > 0 ? (
                options.map((option) => (
                  <SelectItem key={option.value} value={`${option.value}`}>
                    {getDisplayText(option)}
                  </SelectItem>
                ))
              ) : (
                <div className="flex justify-center p-5 text-sm text-[#9EA5AB]">
                  No Records Found
                </div>
              )}

              {/* {options && options?.length === 0 && (
                <div className="flex justify-center p-5 text-sm text-[#9EA5AB]">
                  No Records Found
                </div>
              )}

              {isLoading ? (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  {loadingTitle}
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={`${option.value}`}>
                    {getDisplayText(option)}
                  </SelectItem>
                ))
              )} */}
              {/* {options.map((option) => (
                <SelectItem key={option.value} value={`${option.value}`}>
                  {getDisplayText(option)}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage
            className={cn("", errorClassName)}
            reserveSpace={reserveSpace}
          />
        </FormItem>
      )}
    />
  );
};

export default SelectElement;
