import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ProductVariationOption = {
  productVariation: string;
  name: string;
};

interface DropdownProps {
  options: ProductVariationOption[];
  value?: ProductVariationOption | null;
  onChange: (option: ProductVariationOption) => void;
  placeholder?: string;
}

export function ProductVariationDropdown({
  options,
  value,
  onChange,
  placeholder = "Select product",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: ProductVariationOption) => {
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
        <span>{value?.name ?? placeholder}</span>
        <span className="text-muted-foreground">▾</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md"
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options
            </div>
          )}

          {options.map((option) => (
            <div
              key={option.productVariation}
              onClick={() => handleSelect(option)}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                value?.productVariation === option.productVariation &&
                  "bg-accent"
              )}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
