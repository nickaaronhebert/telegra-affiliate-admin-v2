import PaymentSvg from "@/assets/icons/Payment";

const PaymentMethods = () => {
  return (
    <div
      id="paymentMethodsInformation"
      className="bg-white rounded-[10px] shadow-sm p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-2">
        <div className="flex gap-2 items-center">
          <PaymentSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Payment Methods</h1>
        </div>
      </div>
      <div className="mt-3"></div>
    </div>
  );
};
export default PaymentMethods;
