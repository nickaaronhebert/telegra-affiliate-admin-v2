import { cn } from "@/lib/utils";

export function CenteredRow({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex gap-5 justify-center items-center", className)}>
      {children}
    </div>
  );
}
