import { useParams } from "react-router-dom";
import { useViewCouponByIdQuery } from "@/redux/services/coupon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CouponDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useViewCouponByIdQuery(id!);

  if (isLoading) {
    return <div className="p-6">Loading coupon details...</div>;
  }

  if (error || !data?.data) {
    return <div className="p-6">Error loading coupon details</div>;
  }

  const coupon = data.data;
  const isExpired = new Date(coupon.dateExpires) < new Date();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupon Details</h1>
        <Badge variant={coupon.status === "active" ? "default" : "destructive"}>
          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Coupon Code</label>
              <p className="font-mono text-lg font-bold">{coupon.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p>{coupon.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Discount Type</label>
              <div className="flex items-center gap-2">
                <Badge variant={coupon.discountType === "percent" ? "default" : "secondary"}>
                  {coupon.discountType === "percent" ? `${coupon.amount}%` : `$${coupon.amount}`}
                </Badge>
                <span className="text-sm text-gray-500">
                  {coupon.discountType === "percent" ? "Percentage Discount" : "Fixed Amount Discount"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Free Shipping</label>
              <Badge variant={coupon.freeShipping ? "default" : "secondary"}>
                {coupon.freeShipping ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Individual Use Only</label>
              <Badge variant={coupon.individualUse ? "default" : "secondary"}>
                {coupon.individualUse ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage & Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Usage Count</label>
              <p className="text-lg font-medium">{coupon.usageCount} / {coupon.usageLimit} used</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Usage Limit Per User</label>
              <p>{coupon.usageLimitPerUser}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Minimum Amount</label>
              <p>${coupon.minimumAmount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Maximum Amount</label>
              <p>${coupon.maximumAmount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Expiry Date</label>
              <div className="flex items-center gap-2">
                <p className={isExpired ? "text-red-600 font-medium" : ""}>
                  {new Date(coupon.dateExpires).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {isExpired && (
                  <Badge variant="destructive">Expired</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Restrictions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            {coupon.productIds.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">This coupon can only be used with the following products:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coupon.productIds.map((product, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Price: ${product.currentPrice}</p>
                      <p className="text-xs text-gray-400">Type: {product.productType}</p>
                      {product.isSubscription && (
                        <Badge variant="outline" className="mt-1">Subscription</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No product restrictions - can be used with any product</p>
            )}
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-8">
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p>{new Date(coupon.createdAt).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p>{new Date(coupon.updatedAt).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}