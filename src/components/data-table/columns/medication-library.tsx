import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export interface MedicationVariant {
  id: string;
  strength: string;
  quantityType: string;
  containerQuantity: number;
}

export type Medication = {
  id: string;
  _id: string;
  drugName: string;
  productVariants: MedicationVariant[];
  category: string;
  availablePharmacies?: number;
  dosageForm: string;
  compound?: string;
  instructions?: string;
  administrationNotes?: string;
};

export interface PharmacyVariant {
  strength: string;
  price: number;
  container: string;
  stockStatus: "In Stock" | "Limited" | "Out of Stock";
}

export interface Pharmacy {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  variants: PharmacyVariant[];
}

interface medicationLibraryColumnsProps {
  entity: "CtrlAdmin" | "Organization";
}

export function medicationLibraryColumns({
  entity,
}: medicationLibraryColumnsProps): ColumnDef<Medication>[] {
  return [
    {
      accessorKey: "drugName",
      header: "Medication",
      cell: ({ row }) => (
        <p className="font-medium text-[12px] leading-[16px] text-black">
          {row.getValue("drugName")}
        </p>
      ),
    },
    // {
    //   accessorKey: "variants",
    //   header: "Variants",
    //   cell: ({ row }) => {
    //     const variants: MedicationVariant[] = row.original.productVariants;
    //     return (
    //       <div className="flex flex-col">
    //         <div className="flex gap-2 items-center">
    //           {variants?.map((v) => (
    //             <span
    //               key={v.id}
    //               className="px-[8px] font-semibold text-[12px] leading-[16px] text-black py-[4px] text-xs rounded-[5px] bg-light-background "
    //             >
    //               {v?.strength}
    //             </span>
    //           ))}
    //         </div>
    //         <span className="font-medium ml-[3px] mt-[2px] text-[10px] leading-[12px] text-slate">
    //           {row.original.dosageForm}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        const categoryColor =
          category === "Type 2 Diabetes"
            ? "bg-strength text-queued"
            : "bg-secondary text-category-secondary";
        return (
          <span
            className={`px-[8px] py-[4px] text-[12px] rounded-[5px] font-semibold ${categoryColor}`}
          >
            {category}
          </span>
        );
      },
    },
    {
      accessorKey: "dosageForm",
      header: "Dosage Form",
      cell: ({ row }) => (
        <p className="font-semibold text-[12px] leading-[16px] text-black">
          {row.getValue("dosageForm")}
        </p>
      ),
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        const urlPrefix =
          entity === "CtrlAdmin" ? "/admin/medications/" : "/org/medications/";
        return (
          <Link
            to={`${urlPrefix}${row.original._id}`}
            className="flex justify-center items-center py-1 px-5 w-[85px] h-[36px] rounded-[50px] border border-primary-foreground"
          >
            View
          </Link>
        );
      },
    },
  ];
}
