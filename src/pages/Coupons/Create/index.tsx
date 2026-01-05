import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCouponSchema, type CreateCouponFormData } from "@/schemas/createCouponSchema";
import { useCreateCouponMutation } from "@/redux/services/coupon";

export default function CreateCoupon() {
  const navigate = useNavigate();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const form = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      discountType: "percent",
      amount: 0,
      description: "",
      usageLimit: undefined,
      usageLimitPerUser: undefined,
      minimumAmount: undefined,
      maximumAmount: undefined,
      dateExpires: "",
      status: "active",
    },
  });

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    form.setValue("code", result);
  };

  const onSubmit = async (data: CreateCouponFormData) => {
    try {
      const payload = {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        amount: data.amount,
        freeShipping: false,
        individualUse: true,
        usageLimit: data.usageLimit || 0,
        usageLimitPerUser: data.usageLimitPerUser || 0,
        minimumAmount: data.minimumAmount || 0,
        maximumAmount: data.maximumAmount || 0,
        dateExpires: data.dateExpires ? new Date(data.dateExpires).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: data.status,
        productIds: [],
      };

      await createCoupon(payload).unwrap();
      toast.success("Coupon created successfully!");
      navigate("/coupons");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <>
      <div className="bg-lilac py-3 px-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/coupons")}
          className="font-normal text-sm text-muted-foreground p-0 hover:text-inherit hover:bg-transparent focus:outline-none pointer"
        >
          {"<- Back to Coupons"}
        </Button>
        <h1 className="text-2xl font-bold mt-1">Add Coupon</h1>
      </div>

      <div
        className="m-10 rounded-[15px] max-w-[815px] mx-auto p-6 bg-white"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
                
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-semibold">Add Coupon Details</CardTitle>
            </CardHeader>
            
              {/* Coupon Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-[var(--card-foreground)]">Coupon Code<span className="text-[var(--destructive)]">*</span></FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          className="w-full uppercase"
                          placeholder="Eg. SAVE20"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())} required
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRandomCode}
                        className="text-[var(--primary)] bg-[var(--button-background)] border-0 hover:bg-[var(--primary)] hover:text-[var(--button-background)]" 
                        style={{ cursor: "pointer" }}
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">Uppercase letters and numbers only</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
                            {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this coupon"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Discount Type */}
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-[var(--card-foreground)]">Discount Type <span className="text-[var(--destructive)]">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percent">Percentage</SelectItem>
                        <SelectItem value="fixed_cart">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount Value */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-[var(--card-foreground)]">
                      Discount Value {form.watch("discountType") === "percent" ? "(%)" : "($)"}<span className="text-[var(--destructive)]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        type="number"
                        placeholder="Enter discount value"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        min="0"
                        step={form.watch("discountType") === "percent" ? "1" : "0.01"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

              <CardHeader className="p-0 mt-6 mb-4 pt-6 border-t">
            <p className="text-lg font-semibold">Advanced Options</p>
              </CardHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Usage Limit */}
                    <FormField
                      control={form.control}
                      name="usageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Usage Limit Per User */}
                    <FormField
                      control={form.control}
                      name="usageLimitPerUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Usage Limit per User</FormLabel>
                          <FormControl>
                            <Input
                                className="w-full"
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Minimum Amount */}
                    <FormField
                      control={form.control}
                      name="minimumAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Minimum Amount</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">$</span>

                            <Input
                              className="w-full pl-7"
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Maximum Amount */}
                    <FormField
                      control={form.control}
                      name="maximumAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Maximum Amount</FormLabel>

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
                              $
                            </span>

                            <Input
                              className="w-full pl-7"
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                  {/* Expiry Date */}
                  <FormField
                    control={form.control}
                    name="dateExpires"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel className="font-semibold text-[var(--card-foreground)]">Expiry Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border-[var(--light-border)] hover:border-[var(--ring)] focus:ring-[var(--ring)]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger  className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/coupons")}
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-[16px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
            >
              {isLoading ? "Creating..." : "Create Coupon"}
            </Button>
          </div>

            </CardContent>
          </form>
        </Form>
      </div>
    </>
  );
}