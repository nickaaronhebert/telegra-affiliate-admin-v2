import React, { useState, useMemo, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
// import { Edit } from "@/assets/icons/Edit";
import { Eye } from "@/assets/icons/Eye";
import { EyeOff } from "@/assets/icons/EyeOff";
import {
  useGetPaymentProcessorQuery,
  useUpdatePaymentProcessorMutation,
  type UpdatePaymentProcessorRequest,
} from "@/redux/services/billingDetails";
import FinancialManagementSidebar from "./sidebar";
import { ArrowRight, Plus } from "lucide-react";

// type PaymentRow = { name: string; value: string };

export default function FinancialManagementPage() {
  const { data: paymentData, isLoading, error } = useGetPaymentProcessorQuery();

  const [updatePaymentProcessor, { isLoading: isUpdating }] =
    useUpdatePaymentProcessorMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [showSecretKey, setShowSecretKey] = useState(false);

  const [formData, setFormData] = useState<UpdatePaymentProcessorRequest>({
    PROCESSOR_TYPE: "",
    STRIPE_SECRET_KEY: "",
    STRIPE_PUBLISHER_KEY: "",
  });

  // ✅ Normalize array → object
  const normalizedPaymentData = useMemo(() => {
    if (!paymentData?.data) return null;

    return paymentData.data.reduce<Record<string, string>>((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});
  }, [paymentData]);

  // ✅ Sync normalized data → form
  useEffect(() => {
    if (normalizedPaymentData) {
      setFormData({
        PROCESSOR_TYPE: normalizedPaymentData.PROCESSOR_TYPE || "",
        STRIPE_SECRET_KEY: normalizedPaymentData.STRIPE_SECRET_KEY || "",
        STRIPE_PUBLISHER_KEY: normalizedPaymentData.STRIPE_PUBLISHER_KEY || "",
      });
    }
  }, [normalizedPaymentData]);

  const handleEditClick = () => {
    if (normalizedPaymentData) {
      setFormData({
        PROCESSOR_TYPE: normalizedPaymentData.PROCESSOR_TYPE || "",
        STRIPE_SECRET_KEY: normalizedPaymentData.STRIPE_SECRET_KEY || "",
        STRIPE_PUBLISHER_KEY: normalizedPaymentData.STRIPE_PUBLISHER_KEY || "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePaymentProcessor(formData).unwrap();
      toast.success("Payment processor settings updated successfully");
      setIsDialogOpen(false);
    } catch {
      toast.error("Failed to update payment processor settings");
    }
  };

  const handleInputChange = (
    field: keyof UpdatePaymentProcessorRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const maskSecretKey = (key: string) => (key ? "•".repeat(100) : "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Failed to load payment processor data
      </div>
    );
  }
  return (
    <div className="overflow-x-hidden">
      <div className="flex  w-full">
        {/* Main content */}
        <div className="flex-1 min-w-0 p-6 space-y-2.5 mt-5">
          <div className="flex items-center gap-1.5 ml-7.5">
            <span className="text-[26px] font-semibold text-muted-foreground">
              Settings
            </span>
            <ArrowRight stroke="#63627F" />
            <span className="text-[26px] font-semibold">
              Financial Management
            </span>
          </div>
          <div className="px-6">
            <div className="bg-white rounded-md shadow-sm">
              {/* Header */}
              <div
                className="rounded-t-md p-4"
                style={{ borderBottom: "1px solid var(--card-border)" }}
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-base font-semibold">
                    Payment Processor Configuration
                  </h1>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditClick}
                        className="text-[10px] bg-black text-white pointer"
                      >
                        <Plus className="w-4 h-4" />
                        EDIT
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md p-6">
                      <DialogHeader>
                        <DialogTitle>Edit Payment Processor</DialogTitle>
                      </DialogHeader>

                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Payment Processor</Label>
                          <Select
                            value={formData.PROCESSOR_TYPE}
                            onValueChange={(v) =>
                              handleInputChange("PROCESSOR_TYPE", v)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select processor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stripe">Stripe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Secret Key</Label>
                          <Input
                            value={formData.STRIPE_SECRET_KEY}
                            onChange={(e) =>
                              handleInputChange(
                                "STRIPE_SECRET_KEY",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Publisher Key</Label>
                          <Input
                            value={formData.STRIPE_PUBLISHER_KEY}
                            onChange={(e) =>
                              handleInputChange(
                                "STRIPE_PUBLISHER_KEY",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-2xl cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isUpdating}
                            className="rounded-2xl text-white cursor-pointer"
                          >
                            {isUpdating ? "Updating..." : "Update"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6 min-h-[350px]">
                <div className="p-4 bg-(--light-background) border-(--card-border) rounded-md space-y-4">
                  {/* Payment Processor */}
                  <div className="flex items-center justify-between gap-6">
                    <Label className="text-muted-foreground font-normal whitespace-nowrap">
                      Payment Processor
                    </Label>

                    <div className="text-sm max-w-[60%] truncate text-right">
                      {normalizedPaymentData?.PROCESSOR_TYPE ||
                        "Not configured"}
                    </div>
                  </div>

                  {/* Secret Key */}
                  <div className="flex items-center justify-between gap-6">
                    <Label className="text-muted-foreground font-normal whitespace-nowrap">
                      Secret Key
                    </Label>

                    <div className="relative flex items-center gap-2 max-w-[60%]">
                      <span
                        className="text-sm truncate block"
                        title={
                          normalizedPaymentData?.STRIPE_SECRET_KEY ||
                          "Not configured"
                        }
                      >
                        {/* {showSecretKey
                          ? normalizedPaymentData?.STRIPE_SECRET_KEY ||
                            "Not configured"
                          : maskSecretKey(
                              normalizedPaymentData?.STRIPE_SECRET_KEY || ""
                            )} */}
                        {maskSecretKey(
                          normalizedPaymentData?.STRIPE_SECRET_KEY || ""
                        ) || "Not configured"}
                      </span>

                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                      >
                        {showSecretKey ? <EyeOff /> : <Eye />}
                      </Button> */}
                    </div>
                  </div>

                  {/* Publisher Key */}
                  <div className="flex items-center justify-between gap-6">
                    <Label className="text-muted-foreground font-normal whitespace-nowrap">
                      Publisher Key
                    </Label>

                    <div
                      className="text-sm max-w-[60%] truncate text-right"
                      title={
                        normalizedPaymentData?.STRIPE_PUBLISHER_KEY ||
                        "Not configured"
                      }
                    >
                      {normalizedPaymentData?.STRIPE_PUBLISHER_KEY ||
                        "Not configured"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <FinancialManagementSidebar />
      </div>
    </div>
  );
}
