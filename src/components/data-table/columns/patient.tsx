import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { Patient } from "@/types/responses/patient";
import dayjs from "@/lib/dayjs";

export function patientColumns(): ColumnDef<Patient>[] {
  return [
    {
      accessorKey: "firstName",
      header: "Patient Name",
      cell: ({ row }) => {
        const patientId = row.original.id;
        const firstName = row.getValue("firstName") as string;
        const lastName = row.original.lastName;
        return (
          <Link
            to={`/patients/${patientId}`}
            className="text-xs font-medium text-[#008CE3] hover:text-blue-800 hover:underline"
          >
            {firstName} {lastName}
          </Link>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return <p className="text-xs font-medium">{email}</p>;
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        return (
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium">{phone}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        return (
          <p className="text-xs font-medium">
            {dayjs(row.getValue("createdAt"))?.format("MMMM D, YYYY")}
          </p>
        );
      },
    },
  ];
}

export function organizationPatientColumns(): ColumnDef<Patient>[] {
  return [
    {
      accessorKey: "firstName", // just for sorting/filtering on firstName
      header: "Patient",
      cell: ({ row }) => {
        const { firstName, lastName } = row.original; // 👈 no accessor needed
        const patientId = (row.original as any).patientId || row.original.id;
        return (
          <>
            <p className="text-sm font-medium">
              {`${firstName} ${lastName ?? ""}`}
            </p>
            <p className="text-[10px] font-medium text-[#3E4D61]">
              {patientId}
            </p>
          </>
        );
      },
    },

    {
      accessorKey: "gender",
      header: "Demographics",

      cell: ({ row }) => {
        const { createdAt } = row.original;
        const gender = (row.original as any).gender || "N/A";
        const formattedDate = new Date(createdAt).toLocaleDateString("en-US");
        return (
          <p className="text-xs font-medium">{`${gender}, ${formattedDate}`}</p>
        );
      },
    },

    {
      accessorKey: "email",
      header: "Contact Information",

      cell: ({ row }) => {
        const { email } = row.original;
        const phoneNumber =
          (row.original as any).phoneNumber || row.original.phone;
        const addresses = (row.original as any).addresses || [];
        const defaultAddress = addresses.filter(
          (address: any) => address.isDefault === true
        )?.[0];

        return (
          <>
            <p className="text-xs font-medium">{email}</p>
            <p className="text-xs font-medium py-0.5">{phoneNumber}</p>
            <p className="text-xs text-gray-600">{`${
              (defaultAddress as any)?.address1 || ""
            } ${(defaultAddress as any)?.address2 || ""}`}</p>
          </>
        );
      },
    },

    {
      accessorKey: "height",
      header: "Medical Info",

      cell: ({ row }) => {
        const { height, weight } = row.original;

        return (
          <>
            <p className="text-xs font-medium">{`Height: ${height} (inches)`}</p>
            <p className="text-xs font-medium py-0.5">{`Weight: ${weight} (pounds)`}</p>
          </>
        );
      },
    },

    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        return (
          <Link
            to={`/org/patient/${row.getValue("id")}`}
            className="flex justify-center items-center py-1 px-5 w-[85px] h-[36px] rounded-[50px] border border-primary-foreground "
          >
            View
          </Link>
        );
      },
    },
  ];
}
