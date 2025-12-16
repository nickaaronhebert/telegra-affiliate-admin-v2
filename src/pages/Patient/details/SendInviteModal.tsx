import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (inviteType: "email" | "sms") => void;
  isLoading?: boolean;
}

export function SendInviteModal({
  isOpen,
  onClose,
  onSend,
  isLoading = false,
}: SendInviteModalProps) {
  const [inviteMethod, setInviteMethod] = useState<"email" | "sms">("email");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold">
            How would you like to send the link to the patient?
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 mt-6">
          <RadioGroup
            value={inviteMethod}
            onValueChange={(value: "email" | "sms") => {
              setInviteMethod(value);
            }}
            className="flex w-full"
          >
            <div
              className={cn(
                "flex py-4 px-5 justify-between  border  rounded-2xl w-[50%] ",
                inviteMethod === "email" ? "border-primary" : ""
              )}
            >
              <div className="space-y-3">
                <Label htmlFor="email">Email</Label>
              </div>
              <RadioGroupItem value="email" id="email" />
            </div>
            <div
              className={cn(
                "flex  justify-between py-4 px-5  border  rounded-2xl w-[50%] ",
                inviteMethod === "sms" ? "border-primary" : ""
              )}
            >
              <div className="space-y-3">
                <Label htmlFor="sms">SMS</Label>
              </div>
              <RadioGroupItem value="sms" id="sms" />
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="flex-1 rounded-full cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            onClick={() => onSend(inviteMethod)}
            disabled={isLoading}
            className="cursor-pointer text-white flex-1 rounded-full"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
