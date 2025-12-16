import { cn } from "@/lib/utils";

interface DetailCardProps {
  title: string;
  id: string;
  fields: {
    label: string;
    value: string;
    capitalize?: boolean;
    isBadge?: boolean;
    isLink?: boolean;
  }[];
}

export function DetailsCard({ title, fields, id }: DetailCardProps) {
  console.log("fields", fields);
  return (
    <div
      //   className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]"
      id={id}
    >
      <h2 className="text-base font-semibold p-5 border-b border-card-border flex items-center gap-2">
        {/* <Profile color="black" width={16} height={16} /> */}
        {title}
      </h2>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7",
          fields?.length > 0 ? "p-5" : "p-0"
        )}
      >
        {fields.map(({ label, value, capitalize = true }) => (
          <div key={label}>
            <h4 className="text-sm font-light text-muted-foreground">
              {label}
            </h4>

            <span
              className={`text-sm font-semibold text-primary-foreground mt-2 ${
                capitalize ? "capitalize" : ""
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
