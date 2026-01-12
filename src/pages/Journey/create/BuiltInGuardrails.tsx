import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import WarningSVG from "@/assets/icons/Warning";

const BuiltInGuardrails = () => {
  return (
    <div className="my-5">
      <Card className="bg-[#FFF4CC] border border-[#F5D769]  hover:shadow-md m-auto">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-1">
            <div className="flex flex-col ">
              <div className="flex items-center gap-2 mb-2">
                <WarningSVG />
                <span className="text-[#8B6914] text-lg font-bold">
                  Built-in Guardrails
                </span>
              </div>
              <div className="ml-6 flex flex-col">
                <div className="flex">
                  <Dot className={cn("mb-1", "text-[#8B6914]")} />
                  <span className="text-sm text-[#8B6914] font-small">
                    Authentication must come before Payment
                  </span>
                </div>
                <div className="flex">
                  <Dot className={cn("mb-1", "text-[#8B6914]")} />
                  <span className="text-sm text-[#8B6914] font-small">
                    The online visit system is skipped if all questions are
                    answered pre-purchase
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuiltInGuardrails;