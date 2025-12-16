import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { editCouponSchema, type EditCouponFormData } from "@/schemas/editCouponSchema";
import { useUpdateCouponMutation, useViewCouponByIdQuery } from "@/redux/services/coupon";
import { ROUTES } from "@/constants/routes";

export default function EditCoupon() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Validate ID exists
  if (!id) {
    return (
      <div className="lg:p-3.5">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-destructive mb-2">Invalid Coupon ID</h2>
          <p className="text-muted-foreground mb-4">No coupon ID provided in the URL</p>
          <Button onClick={() => navigate("/coupons")} variant="outline">
            Back to Coupons
          </Button>
        </div>
      </div>
    );
  }

  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const { data: couponData, isLoading: isFetching, error } = useViewCouponByIdQuery(id, {
    skip: !id
  });
  const form = useForm<EditCouponFormData>({
    resolver: zodResolver(editCouponSchema),
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

  // Populate form when coupon data is loaded
  useEffect(() => {
    if (couponData) {
      // The API returns the coupon data directly, not nested under 'data'
      const coupon = couponData as any; // Cast to any since the type interface is incorrect
      form.reset({
        code: coupon.code,
        discountType: coupon.discountType,
        amount: coupon.amount,
        description: coupon.description,
        usageLimit: coupon.usageLimit || undefined,
        usageLimitPerUser: coupon.usageLimitPerUser || undefined,
        minimumAmount: coupon.minimumAmount || undefined,
        maximumAmount: coupon.maximumAmount || undefined,
        dateExpires: coupon.dateExpires ? new Date(coupon.dateExpires).toISOString().split('T')[0] : "",
        status: coupon.status,
      });
    }
  }, [couponData, form]);

  const onSubmit = async (data: EditCouponFormData) => {
    if (!id) return;

    try {
      const payload = {
        id,
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

      await updateCoupon(payload).unwrap();
      toast.success("Coupon updated successfully!");
      navigate("/coupons");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update coupon");
    }
  };

  if (isFetching) {
    return (
      <div className="lg:p-3.5">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !couponData) {
    return (
      <div className="lg:p-3.5">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Coupon</h2>
          <p className="text-muted-foreground mb-4">Unable to load coupon details</p>

          {/* Debug information */}
          <div className="mb-4 p-4 bg-gray-100 rounded text-left text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>ID: {id}</p>
            <p>isFetching: {isFetching.toString()}</p>
            <p>Error: {error ? JSON.stringify(error, null, 2) : 'No specific error'}</p>
            <p>Coupon Data: {couponData ? JSON.stringify(couponData, null, 2) : 'No data received'}</p>
            <p>Data.data exists: {couponData?.data ? 'Yes' : 'No'}</p>
            <p>Direct couponData exists: {couponData ? 'Yes' : 'No'}</p>
            <p>URL: {window.location.href}</p>
            <p>Current Route ID: {id}</p>
          </div>

          <Button onClick={() => navigate("/coupons")} variant="outline">
            Back to Coupons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-[45px] py-[12px] bg-[var(--lilac)] mx-auto mb-6">
        <div className="">
          <Button
            variant="ghost"
            onClick={() => navigate("/coupons")}
            className="text-sm text-[var(--muted-foreground)] p-0 hover:text-inherit hover:bg-transparent focus:outline-none pointer font-normal"
          >
            ← Back to Coupons
          </Button>
        </div>

        <h1 className="text-lg font-semibold">Edit Coupon</h1>
      </div>

      <div className="max-w-4/5 mx-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <Card className="border-0 p-10">
              <CardContent className="space-y-6 w-4/5 justify-center mx-auto">

                <CardHeader className="p-0">
                  <CardTitle>Edit Coupon Details</CardTitle>
                </CardHeader>

                {/* Coupon Code - Disabled */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[var(--card-foreground)] border-[var(--border)]">Coupon Code<span className="text-[var(--destructive)]">*</span></FormLabel>
                      <FormControl>
                        <Input
                          className="w-full uppercase bg-[#F4F4F4] cursor-not-allowed"
                          placeholder="Enter coupon code"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <p className="text-xs text-[var(--muted-foreground)]">Coupon code cannot be modified</p>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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

                <CardHeader className="p-0">
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
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
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

                  {/* Maximum Amount */}
                  <FormField
                    control={form.control}
                    name="maximumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Maximum Amount</FormLabel>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
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
                        <FormLabel className="font-semibold">Expiry Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full"
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                    onClick={() => navigate(ROUTES.COUPONS)}
                    className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-[16px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
                  >
                    {isUpdating ? "Updating..." : "Update Coupon"}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}