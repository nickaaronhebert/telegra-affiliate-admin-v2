import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetEncounterTransactionQuery,
  useGetPaymentMethodDetailsQuery,
} from "@/redux/services/encounter";
import dayjs from "@/lib/dayjs";
import { PAYMENT_MECHANISMS_TITLE } from "@/constants";
import { Loader } from "lucide-react";
import { getStatusColors } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export function TransactionDetailsModal({
  isOpen,
  onClose,
  transactionId,
}: TransactionDetailsModalProps) {
  const {
    data: transaction,
    isLoading,
    error,
  } = useGetEncounterTransactionQuery(transactionId || "", {
    skip: !transactionId,
  });

  // Fetch payment method details only if paymentMethod exists
  const paymentMethodId = transaction?.paymentMethod || null;
  const patientId = transaction?.order?.patient?._id || null;

  const { data: paymentMethodDetails, isLoading: isPaymentMethodLoading } =
    useGetPaymentMethodDetailsQuery(
      {
        paymentId: paymentMethodId || "",
        patientId: patientId || "",
      },
      {
        skip: !paymentMethodId || !patientId,
      }
    );

  if (!transactionId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full !max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-gray-600">No Transaction Available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!transaction && isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full !max-w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 animate-spin text-gray-600" />
              <p className="text-sm text-gray-600">
                Loading transaction details...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !transaction) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full !max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-red-600">Failed to load transaction details</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const productName =
    transaction.order?.productVariations?.[0]?.productVariation?.product
      ?.title || "Product";
  const formattedDate = dayjs(transaction.createdAt).format("MMM DD, YYYY");
  const patientName = `${transaction.order?.patient?.firstName || ""} ${
    transaction.order?.patient?.lastName || ""
  }`.trim();
  const description = transaction?.order?.address
    ? `${transaction?.order?.address?.billing?.address1},
    ${transaction?.order?.address?.billing?.city}`
    : "";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full !max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 p-4">
          <DialogTitle className="text-lg font-semibold">
            Transaction ID:
            {transaction.id?.length > 40
              ? `${transaction.id.substring(0, 40)}...`
              : transaction.id}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-6">
          {/* Product and Price Section */}
          <div className="space-y-3 bg-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-600">{productName}</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">
                ${transaction.amount.toFixed(2)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  getStatusColors(transaction.status)?.badge
                }`}
              >
                {getStatusColors(transaction.status)?.label}
              </span>
            </div>
          </div>

          {/* Patient and Date Section */}
          <div className="grid grid-cols-2 gap-6 py-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Patient</p>
              <p className="text-sm font-semibold text-gray-900">
                {patientName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Payment Details
            </h3>
            <div className="space-y-2 rounded-lg p-5 bg-gray-100 rounded-xl border border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Mechanism</span>
                <span className="font-medium text-gray-900">
                  {PAYMENT_MECHANISMS_TITLE[
                    transaction.order?.project
                      ?.paymentMechanism as keyof typeof PAYMENT_MECHANISMS_TITLE
                  ] || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium px-2 py-1 rounded text-xs ${
                    getStatusColors(transaction.status).badge
                  }`}
                >
                  {getStatusColors(transaction.status).label}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          {transaction.paymentMethod && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Payment Method
              </h3>
              {isPaymentMethodLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              ) : paymentMethodDetails ? (
                <div className="space-y-2 rounded-lg p-5 bg-gray-100 rounded-xl border border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">
                      {"Credit Card"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number</span>
                    <span className="font-medium text-gray-900">
                      {`****${paymentMethodDetails.last4}` || "••••"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Owner</span>
                    <span className="font-medium text-gray-900">
                      {paymentMethodDetails.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expiration</span>
                    <span className="font-medium text-gray-900">
                      {paymentMethodDetails.expMonth}/
                      {paymentMethodDetails.expYear || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium text-gray-900">
                      {description || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Unable to load payment method details
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
