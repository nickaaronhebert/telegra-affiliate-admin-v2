import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// type Option = {
//   label: string;
//   value: string;
// };

export type AddressOption = {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  state: {
    id: string;
    name: string;
  };
  zipcode: string;
};

interface DropdownProps {
  options: AddressOption[];
  value?: AddressOption | null;
  onChange: (option: AddressOption) => void;
  placeholder?: string;
  optionClass?: string;
}

export function AddressDropdown({
  options,
  value,
  onChange,
  optionClass,
  placeholder = "Select option",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: AddressOption) => {
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
        <span>{value?.address1 ?? placeholder}</span>
        <span className="text-muted-foreground">▾</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md p-2"
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options
            </div>
          )}

          <div className={cn("", optionClass)}>
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option)}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                  value?.id === option.id && "bg-accent"
                )}
              >
                {`${option.address1},${option.city},${option.state.name}, ${option.zipcode}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
