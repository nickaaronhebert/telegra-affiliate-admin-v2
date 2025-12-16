interface ProductVariationsProps {
  items: {
    name: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}
export default function ProductVariations({ items }: ProductVariationsProps) {
  const totalPrice = items?.reduce((acc, item) => acc + item.total, 0);
  return (
    <div className="w-full  mx-auto p-6">
      <div className="bg-light-background rounded-lg  overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-light-background border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Items
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Price
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Qty
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-4 px-4">
                  <div className="flex items-baseline gap-1">
                    <span className=" text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                    {/* <span className="text-sm text-gray-500">- {item.dosage}</span> */}
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 text-sm">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 text-sm">
                  x {item.quantity}
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 text-sm">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end px-2 mt-2">
        <div className="flex gap-32">
          <h2 className="text-lg font-semibold">Order Totals</h2>
          <h2 className="text-lg font-semibold">{`$${totalPrice.toFixed(
            2
          )}`}</h2>
        </div>
      </div>
    </div>
  );
}
