import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  //   rightIcon?: React.ReactNode;
  tooltip?: string;
}

const InputField = ({
  label,
  name,
  type = "text",
  required = false,
  leftIcon,
  //   rightIcon,
  tooltip,
  className,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormItem>
      {label && (
        <FormLabel
          htmlFor={name}
          className="text-[14px] leading-[18px] font-semibold text-black"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <Input
            id={name}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            {...props}
            className={cn(
              "h-12 border-border focus:bg-white focus:border-blue-200 focus-visible:ring-blue-200",
              leftIcon ? "pl-10" : "",
              isPassword ? "pr-10" : "",
              className
            )}
          />
          {isPassword && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          )}
          {/* {!isPassword && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )} */}
        </div>
      </FormControl>
      <FormMessage className="text-right" />
    </FormItem>
  );
};

export default InputField;
