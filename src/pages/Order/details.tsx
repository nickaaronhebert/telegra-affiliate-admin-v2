import {
  useCancelOrderMutation,
  useViewOrderByIdQuery,
} from "@/redux/services/order";
import dayjs from "@/lib/dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "lucide-react";
import { Users } from "lucide-react";
import { Pill } from "lucide-react";
import { CreditCard } from "lucide-react";
import { useState } from "react";

import CubeSVG from "@/assets/icons/Cube";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/Dialog";
import { toast } from "sonner";

interface EntityDetailProps {
  title: string;

  fields: {
    label: string;
    value: string;
    capitalize: boolean;
  }[];

  billingAddress: {
    address: string;
    city: string;
    zipcode: string;
  };

  shippingAddress: {
    address: string;
    city: string;
    zipcode: string;
  };
}

interface AddressCardProps {
  title: string;
  address: string;
  city: string;
  zipcode: string;
}

interface ProductVariationsProps {
  items: {
    name: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}

interface DetailCardProps {
  title: string;
  id: string;
  fields: {
    label: string;
    value: string;
    capitalize: boolean;
    isBadge?: boolean;
    isLink?: boolean;
  }[];
}

const menuItems = [
  {
    title: "Order Overview",
    scrollToId: "orderOverview",
    icon: <Activity />,
  },
  {
    title: "Patient Details",
    scrollToId: "patientInformation",
    icon: <Users />,
  },

  {
    title: "Order Items",
    scrollToId: "orderInformation",
    icon: <Pill />,
  },
  {
    title: "Payment Information",
    scrollToId: "paymentInformation",
    icon: <CreditCard />,
  },
];

function ProductVariations({ items }: ProductVariationsProps) {
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

function AddressCard({ title, address, city, zipcode }: AddressCardProps) {
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
function PatientDetail({
  title,
  fields,
  billingAddress,
  shippingAddress,
}: EntityDetailProps) {
  return (
    <div
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]"
      id="patientInformation"
    >
      <h2 className="text-base font-semibold p-5 border-b border-card-border flex items-center gap-2">
        {/* <Profile color="black" width={16} height={16} /> */}
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 p-5">
        {fields.map(({ label, value, capitalize }) => (
          <div key={label}>
            <h4 className="text-sm font-normal text-muted-foreground">
              {label}
            </h4>
            <span
              className={`text-sm font-semibold text-primary-foreground mt-2 ${
                capitalize ? "capitalize" : ""
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="p-5 flex gap-6">
        <AddressCard
          address={billingAddress.address}
          city={billingAddress.city}
          zipcode={billingAddress.zipcode}
          title="Billing Details"
        />

        <AddressCard
          address={shippingAddress.address}
          city={shippingAddress.city}
          zipcode={shippingAddress.zipcode}
          title="Shipping Details"
        />
      </div>
    </div>
  );
}

function DetailsCard({ title, fields, id }: DetailCardProps) {
  return (
    <div
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]"
      id={id}
    >
      <h2 className="text-base font-semibold p-5 border-b border-card-border flex items-center gap-2">
        {/* <Profile color="black" width={16} height={16} /> */}
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 p-5">
        {fields.map(({ label, value, capitalize }) => (
          <div key={label}>
            <h4 className="text-sm font-light text-muted-foreground">
              {label}
            </h4>

            <span
              className={`text-sm font-semibold text-primary-foreground mt-2 ${
                capitalize ? "capitalize" : ""
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ViewEcommerceOrderDetails() {
  const navigate = useNavigate();

  const [cancelEcommerceOrder] = useCancelOrderMutation();
  const [cancelOrder, setCancelOrder] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "patientInformation"
    | "orderOverview"
    | "orderInformation"
    | "paymentInformation"
  >("orderOverview");
  const { id } = useParams();
  const { data } = useViewOrderByIdQuery(id as string, {
    skip: !id,
    selectFromResult: ({ data, isLoading, isError }) => ({
      data: {
        ...data,
        items: data?.productVariations?.map((item) => {
          return {
            name: item.name,
            price: item.pricePerUnitOverride,
            quantity: item.quantity,
            total: item.pricePerUnitOverride * item.quantity,
          };
        }),
      },
      isLoading,
      isError,
    }),
  });

  function handleEditClick() {
    navigate(`/edit-order/${id}`);
  }

  return (
    <div>
      <div className="bg-lilac py-3 px-12 flex justify-between items-center">
        <div className="">
          <Link
            to={"/orders"}
            className="font-normal text-sm text text-muted-foreground"
          >
            {"<- Back to Orders"}
          </Link>

          <h1 className="text-2xl font-bold mt-1">View Commerce Order</h1>
        </div>
        <div className="space-x-2">
          {data.isLockedin === false && (
            <Button
              className="rounded-full cursor-pointer text-black border-black p-5 bg-transparent hover:bg-transparent hover:text-black"
              variant={"outline"}
              onClick={handleEditClick}
            >
              Edit Commerce Order
            </Button>
          )}
          {data?.isCancelable && (
            <Button
              className="rounded-full cursor-pointer text-destructive border-destructive p-5 bg-transparent hover:bg-transparent hover:text-destructive"
              variant={"outline"}
              onClick={() => setCancelOrder(true)}

              // onClick={handleOrderTransmission}
            >
              Cancel Order
            </Button>
          )}
        </div>
        {/* {data?.transmissionMethod === "manual" &&
          data?.status === "Transmittable" && (
            <Button
              className="rounded-full cursor-pointer text-white p-5"
              onClick={handleOrderTransmission}
            >
              Transmit Order
            </Button>
          )} */}
      </div>
      <div className="flex gap-8 px-14 mt-6">
        <div
          className="w-lg  max-w-80
         rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] h-fit"
        >
          <div className="p-3">
            <div className="flex gap-3.5 items-center ">
              <div className="w-[50px] h-[50px] flex justify-center items-center bg-lilac rounded-xl">
                <CubeSVG />
              </div>
              <div>
                <h4 className="text-base font-semibold text-black">
                  {`Order #${data?.ecommerceOrderId ?? "-"}`}
                </h4>
                {/* <h6 className="text-xs font-normal text-[#3E4D61]">
                  {transmissionsLength} Transmission{" "}
                  {transmissionsLength! > 1 ? "s" : ""}
                </h6> */}
              </div>
            </div>
          </div>
          {menuItems.map((item, index) => {
            return (
              <Button
                key={item.title}
                className={`flex justify-start items-center w-full rounded-none text-white text-sm p-5 font-medium cursor-pointer !h-14 ${
                  activeTab === item.scrollToId
                    ? "bg-primary"
                    : "bg-white text-black hover:bg-white"
                }
              
              ${
                index === menuItems.length - 1
                  ? "rounded-bl-[10px] rounded-br-[10px]"
                  : ""
              }
              `}
                onClick={() => {
                  setActiveTab(item.scrollToId as any);
                  document.getElementById(item.scrollToId)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {item.icon}
                {item.title}
              </Button>
            );
          })}
        </div>

        <div className="w-[70%] space-y-4">
          <DetailsCard
            id="orderOverview"
            title="Order Overview"
            fields={[
              {
                label: "Status",
                capitalize: true,
                value: data?.status || "-",
              },
              {
                label: "Total Medications",
                capitalize: true,
                value: data?.productVariations?.length?.toString() || "-",
              },
              {
                label: "Total Amount",
                capitalize: true,
                value: data?.totalAmount?.toString() || "-",
              },
              {
                label: "Created on",
                capitalize: false,
                value: data?.createdAt
                  ? dayjs(data.createdAt)?.format("MMMM D, YYYY")
                  : "-",
              },
              {
                label: "Encounter Link",
                capitalize: true,
                value: "-",
              },
            ]}
          />
          <PatientDetail
            title="Patient Details"
            fields={[
              {
                label: "Patient Name",
                capitalize: true,
                value: data?.patient?.name || "-",
              },
              {
                label: "Gender",
                capitalize: true,
                value: data?.patient?.genderBiological || "-",
              },
              {
                label: "Date of Birth",
                capitalize: true,
                value: data?.patient?.dateOfBirth
                  ? dayjs(data.patient.dateOfBirth)?.format("MMMM D, YYYY")
                  : "-",
              },
              {
                label: "Email",
                capitalize: false,
                value: data?.patient?.email || "-",
              },
              {
                label: "Phone Number",
                capitalize: true,
                value: data?.patient?.phone || "-",
              },
            ]}
            billingAddress={{
              address: `${data?.billingDetails?.address1}${
                data?.billingDetails?.address2
                  ? ", " + data?.billingDetails?.address2
                  : ""
              }`,
              city: data?.billingDetails?.city || "-",
              zipcode: data?.billingDetails?.zipcode || "-",
            }}
            shippingAddress={{
              address: `${data?.shippingDetails?.address1}${
                data?.shippingDetails?.address2
                  ? ", " + data?.shippingDetails?.address2
                  : ""
              }`,
              city: data?.shippingDetails?.city || "-",
              zipcode: data?.shippingDetails?.zipcode || "-",
            }}
          />

          <div
            className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]"
            id="orderInformation"
          >
            <h2 className="text-base font-semibold p-5 border-b border-card-border flex items-center gap-2">
              {/* <Profile color="black" width={16} height={16} /> */}
              Order Items
            </h2>

            <ProductVariations items={data?.items ?? []} />
          </div>

          <DetailsCard
            id="paymentInformation"
            title="Payment Information"
            fields={[
              {
                label: "Payment Method",
                capitalize: true,
                value: "Credit Card",
              },
              {
                label: "Card Information",
                capitalize: true,
                value:
                  `${data?.paymentDetails?.cardBrand}**** ${data?.paymentDetails?.last4}` ||
                  "-",
              },
              {
                label: "Currency",
                capitalize: true,
                value: data?.paymentDetails?.currency || "-",
              },
            ]}
          />
        </div>
      </div>

      {cancelOrder && (
        <ConfirmDialog
          open={cancelOrder}
          onOpenChange={setCancelOrder}
          title="Cancel Commerce Order?"
          onConfirm={async () => {
            await cancelEcommerceOrder(id as string)
              .unwrap()
              .then((data) => {
                toast.success(data?.message || "Order Cancelled Successfully", {
                  duration: 1500,
                });
                setCancelOrder(false);
              })
              .catch((err) => {
                console.log("error", err);
                toast.error("Something went wrong", {
                  duration: 1500,
                });
              });
          }}
          cancelTextVariant={"outline"}
          confirmTextVariant={"destructive"}
          confirmTextClass="bg-destructive text-white rounded-[50px] px-[20px] py-[5px] cursor-pointer min-w-[110px] min-h-[40px]"
          cancelTextClass="bg-white border border-slate-foreground rounded-[50px] px-[20px] py-[5px] cursor-pointer min-w-[110px] min-h-[40px]"
        >
          <div>
            <p className="text-muted-foreground text-sm font-normal">
              Are you sure you want to cancel this order?
            </p>
            <p className="text-muted-foreground text-sm font-normal">
              This action cannot be undone.
            </p>
          </div>
        </ConfirmDialog>
      )}
    </div>
  );
}
