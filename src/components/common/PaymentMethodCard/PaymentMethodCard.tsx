import { type FC } from "react";
import dayjs from "@/lib/dayjs";
import { Label } from "@/components/ui/label";
import { CreditCard, Trash2 } from "lucide-react";
import VisaSVG from "@/assets/icons/Visa";
import { PAYMENT_BRANDS } from "@/constants";
import { Button } from "@/components/ui/button";

type PaymentBrandType = (typeof PAYMENT_BRANDS)[keyof typeof PAYMENT_BRANDS];

interface IPaymentMethod {
  paymentId: string;
  cardBrand: PaymentBrandType | string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault?: boolean;
  name?: string;
  postalCode?: string;
}

type TPaymentMethodCardProps = {
  paymentInfo: Partial<IPaymentMethod>;
  onSelect: (paymentId: string) => void;
  disabled?: boolean;
  isSelected?: boolean;
  name?: string;
  OnDelete?: () => void;
};

const PaymentMethodCard: FC<TPaymentMethodCardProps> = ({
  paymentInfo,
  onSelect,
  disabled = false,
  isSelected = false,
  name = "payment",
  OnDelete = () => {},
}) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const icon =
    paymentInfo.cardBrand === PAYMENT_BRANDS.Visa ? (
      <VisaSVG />
    ) : (
      <CreditCard className="w-8 h-8 text-gray-400" />
    );

  const cardBrandDisplay = paymentInfo?.cardBrand
    ? capitalize(paymentInfo.cardBrand)
    : "";
  const expirationDate =
    paymentInfo?.expMonth && paymentInfo?.expYear
      ? `Expires ${dayjs()
          .month(Number(paymentInfo.expMonth) - 1)
          .format("MMM")} ${paymentInfo.expYear}`
      : "";

  return (
    <div className="w-full mb-3">
      <div className="flex items-start gap-3">
        <input
          type="radio"
          id={paymentInfo?.paymentId}
          name={name}
          value={paymentInfo?.paymentId || ""}
          checked={isSelected}
          onChange={() => onSelect(paymentInfo?.paymentId || "")}
          disabled={disabled}
          className="mt-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <Label
          htmlFor={paymentInfo?.paymentId}
          className="flex-1 cursor-pointer"
        >
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors w-full">
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {`${cardBrandDisplay} •••• ${paymentInfo?.last4}`}
              </div>
              {expirationDate && (
                <div className="text-sm text-gray-500 mt-1">
                  {expirationDate}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={OnDelete}
              disabled={false}
              className="p-1 h-8 w-8 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </Label>
      </div>
    </div>
  );
};
export default PaymentMethodCard;
