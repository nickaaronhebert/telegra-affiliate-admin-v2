import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface DropdownProps {
  options: Option[];
  value?: Option | null;
  onChange: (option: Option) => void;
  placeholder?: string;
  optionClass?: string;
  loading?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  loading = false,
  optionClass = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 px-3 text-sm",
          "bg-background hover:bg-accent focus:outline-none"
        )}
      >
        <span>{value?.label ?? placeholder}</span>
        <span className="text-muted-foreground">▾</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 p-1 w-full rounded-md border bg-popover shadow-md"
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="p-4 text-sm font-semibold">Loading...</div>
          ) : options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options found
            </div>
          ) : (
            <div className={cn(optionClass)}>
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                    value?.value === option.value && "bg-accent"
                  )}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}

          {/* {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options
            </div>
          )}

          <div className={cn(optionClass)}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                  value?.value === option.value && "bg-accent"
                )}
              >
                {option.label}
              </div>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}
