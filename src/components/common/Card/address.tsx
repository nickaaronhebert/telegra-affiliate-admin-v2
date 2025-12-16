interface AddressCardProps {
  title: string;
  address: string;
  city: string;
  zipcode: string;
}

export default function AddressCard({
  title,
  address,
  city,
  zipcode,
}: AddressCardProps) {
  return (
    <div className="w-[48%] border border-card-border rounded-2xl ">
      <h3 className="text-sm font-semibold px-4 py-2.5 bg-gray-100 rounded-tl-2xl rounded-tr-2xl">
        {title}
      </h3>
      <div className="p-4 space-y-[15px]">
        <div>
          <h5 className="text-sm font-normal text-[#63627F]">Address</h5>
          <h5 className="text-sm font-medium">{address}</h5>
        </div>
        <div>
          <h5 className="text-sm font-normal text-[#63627F]">City</h5>
          <h5 className="text-sm font-medium">{city}</h5>
        </div>
        <div>
          <h5 className="text-sm font-normal text-[#63627F]">Zip Code</h5>
          <h5 className="text-sm font-medium">{zipcode}</h5>
        </div>
      </div>
    </div>
  );
}
