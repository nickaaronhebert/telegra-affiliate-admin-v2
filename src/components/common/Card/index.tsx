import { Skeleton } from "@/components/ui/skeleton";
import { cn, getStatusColors } from "@/lib/utils";
import type { ReactNode } from "react";

interface DetailCardProps {
  title: string;
  id: string;
  isLoading?: boolean;
  fields: {
    label: string;
    value: string;
    capitalize?: boolean;
    isBadge?: boolean;
    isLink?: boolean;
  }[];
  topChild?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
}

export function DetailsCard({
  title,
  fields,
  id,
  isLoading,
  topChild = <></>,
  actions = <></>,
  icon = <></>,
}: DetailCardProps) {
  return (
    <div
      className="min-w-196.5"
      //   className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]"
      id={id}
    >
      <h2 className="text-base font-semibold p-5 border-b border-card-border flex items-center gap-2 justify-between">
        <div className="flex gap-2 items-center justify-center">
          {icon}
          {title}
        </div>
        {actions}
      </h2>

      {topChild}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7",
          fields?.length > 0 ? "p-5" : "p-0"
        )}
      >
        {fields.map(({ label, value, capitalize = true, isBadge }) => (
          <div key={label}>
            <h4 className={`text-sm font-light text-muted-foreground`}>
              {label}
            </h4>

            <span
              className={`text-sm font-semibold  mt-3 ${
                capitalize ? "capitalize " : ""
              }${
                isBadge
                  ? `w-fit px-3 py-1 rounded-l text-xs font-medium uppercase ${
                      getStatusColors(value).badge
                    }`
                  : "text-primary-foreground"
              }`}
            >
              {isLoading ? (
                <Skeleton className="h-4 w-32 mt-3" />
              ) : (
                <>{isBadge ? getStatusColors(value).label : value}</>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
