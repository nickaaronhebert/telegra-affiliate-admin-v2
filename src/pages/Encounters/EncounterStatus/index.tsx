import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface EncounterStatusProps {
  status: string;
  setStatus: (arg: string) => void;
}

const encounterStatusFields = [
  {
    title: "Started",
    key: "started",
  },
  {
    title: "Affiliate Review",
    key: "requires_affiliate_review",
  },
  {
    title: "Submission Required",
    key: "requires_order_submission",
  },
  {
    title: "Waiting Room",
    key: "requires_waiting_room_egress",
  },
];

const encounterProductReviewFields = [
  {
    title: "Provider Review",
    key: "requires_provider_review",
  },
  {
    title: "Order Processing",
    key: "requires_order_processing",
  },
  {
    title: "Delayed",
    key: "delayed",
  },
  {
    title: "Admin Review",
    key: "requires_admin_review",
  },
  {
    title: "Prerequisite required",
    key: "requires_prerequisite_completion",
  },
  {
    title: "Cancelled",
    key: "cancelled",
  },
  {
    title: "Completed",
    key: "completed",
  },
];

const ProductReviewsFields = [
  "requires_provider_review",
  "requires_order_processing",
  "delayed",
  "requires_admin_review",
  "requires_prerequisite_completion",
  "cancelled",
  "completed",
];

export default function EncounterStatus({
  status,
  setStatus,
}: EncounterStatusProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex gap-1.5">
        {encounterStatusFields.map((item) => {
          return (
            <span
              onClick={() => setStatus(item.key)}
              className={cn(
                "cursor-pointer min-w-46.25 rounded-tl-[10px] rounded-tr-[10px] py-3 px-4 text-center text-sm font-medium",
                status === item.key
                  ? "bg-primary text-white"
                  : "bg-[#EFE9F4] text-black"
              )}
            >
              {item.title}
            </span>
          );
        })}

        <div
          className="relative inline-block"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Button */}
          <span
            className={cn(
              "cursor-pointer min-w-46.25 flex items-center justify-center gap-2 rounded-tl-[10px] rounded-tr-[10px] py-3 px-4 text-sm font-medium",
              ProductReviewsFields.includes(status)
                ? "bg-primary text-white"
                : "bg-[#EFE9F4] text-black"
            )}
          >
            {encounterProductReviewFields.find((item) => item.key === status)
              ?.title || "Product Review"}
            <ChevronDown className="h-4 w-4" />
          </span>

          {/* Dropdown */}
          {open && (
            <div className="absolute -left-4 top-full z-50 w-55 rounded-md border bg-white shadow-lg">
              {encounterProductReviewFields.map((item, index) => (
                <div
                  key={item.key}
                  onClick={() => {
                    setStatus(item.key);
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm hover:bg-secondary hover:text-black",
                    status === item.key && "bg-primary font-medium text-white",
                    index === 0 && "rounded-tl-md rounded-tr-md",
                    index === encounterProductReviewFields.length - 1 &&
                      "rounded-bl-md rounded-br-md"
                  )}
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
