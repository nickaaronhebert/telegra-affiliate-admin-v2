import type { LineItem } from "@/types/global/commonTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

// type PatientDetails = Pick<Patient, "firstName" | "lastName" | "phoneNumber">;
export type PharmacyInvoiceDetails = {
  createdAt: string;
  lineItems: LineItem[];
  totalAmount: number;
  transmission: {
    id: string;
    patient: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
};

export function organizationInvoiceColumns(): ColumnDef<PharmacyInvoiceDetails>[] {
  return [
    {
      accessorKey: "createdAt",
      header: "Date",

      cell: ({ row }) => {
        const formattedStartDate = new Date(
          row.getValue("createdAt")
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return <p className="text-xs font-medium">{formattedStartDate}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "lineItems",
      header: "Medication",
      cell: ({ row }) => {
        const medication: LineItem[] = row.getValue("lineItems");
        const displayedMedications = medication.slice(0, 1);
        const remainingCount = medication.length - 1;

        const getTypeColor = (type: "oral" | "Injectable") => {
          return type === "oral" ? "text-green-600" : "text-pink-600";
        };

        return (
          <div className="max-w-sm">
            {displayedMedications.map((medication, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="font-medium text-gray-900 text-sm mb-1">
                  {medication.productVariant?.medicationCatalogue?.drugName}
                </div>
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <span>
                    {medication.productVariant?.containerQuantity}{" "}
                    {medication.productVariant?.quantityType}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mx-2 bg-[#63627F] `}
                  ></div>
                  <span
                    className={`capitalize ${getTypeColor(
                      medication.productVariant?.medicationCatalogue
                        ?.dosageForm as "oral" | "Injectable"
                    )}`}
                  >
                    {medication.productVariant?.medicationCatalogue?.dosageForm}
                  </span>
                </div>
              </div>
            ))}

            {remainingCount > 0 && (
              <div className="mt-3  ">
                <div className="text-blue-600 text-sm font-medium underline underline-offset-2">
                  +{remainingCount} medication{remainingCount > 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "transmission",
      header: "Patient",

      cell: ({ row }) => {
        const patientInfo = row.original.transmission;
        return (
          <>
            <p className="text-xs font-medium">{`${patientInfo?.patient?.firstName} ${patientInfo?.patient?.lastName}`}</p>
            <p className="text-[10px] font-medium">
              {patientInfo?.patient?.phoneNumber}
            </p>
          </>
        );
      },
    },

    {
      accessorKey: "totalAmount",
      header: "Amount",

      cell: ({ row }) => {
        const amount = Number(row.getValue("totalAmount")) || 0;
        return <p className="text-xs font-medium">${amount.toFixed(2)}</p>;
      },
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        return (
          <Link
            to={`/org/transmissions/${row.original.transmission.id}`}
            className="flex justify-center items-center py-1 px-5 w-21.25 h-9 rounded-[50px] border border-primary-foreground "
          >
            View
          </Link>
        );
      },
    },
  ];
}
