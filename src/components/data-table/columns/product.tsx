import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { ProductVariation } from "@/types/responses/IViewAllProducts";
import type { EcommerceProduct } from "@/types/responses/ecommerceProducts";
import type { ICompactTag } from "@/types/responses/tag";
import { PRODUCT_TYPE_VARIANTS } from "@/constants";
import { Tag } from "lucide-react";

export type ProductDetails = ProductVariation;

// Tag cell component props
interface TagsCellProps {
  tags: ICompactTag[];
  productId: string;
  onAssignTags: (productId: string, productName: string, tags: ICompactTag[]) => void;
  productName: string;
}

// Tags cell component
function TagsCell({ tags, productId, onAssignTags, productName }: TagsCellProps) {
  if (!tags || tags.length === 0) {
    return (
      <button
        onClick={() => onAssignTags(productId, productName, [])}
        className="flex items-center gap-1 text-xs text-[#5456AD]  hover:underline cursor-pointer"
      >
        <Tag className="h-3 w-3" />
        Assign Tag
      </button>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-1 cursor-pointer"
      onClick={() => onAssignTags(productId, productName, tags)}
    >
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            border: `1px solid ${tag.color}40`,
          }}
        >
          {tag.name}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="text-xs text-gray-500">+{tags.length - 3}</span>
      )}
    </div>
  );
}

export function ecommerceProductColumns(
  onAssignTags?: (productId: string, productName: string, tags: ICompactTag[]) => void
): ColumnDef<EcommerceProduct>[] {
  return [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => {
        const productId = row.original.id;
        return (
          <Link
            to={`/products/${productId}`}
            className="text-xs font-medium text-[#008CE3] hover:text-blue-800 hover:underline"
          >
            {row.getValue("name")}
          </Link>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.original.tags || [];
        const productId = row.original.id;
        const productName = row.original.name;

        return (
          <TagsCell
            tags={tags}
            productId={productId}
            productName={productName}
            onAssignTags={onAssignTags || (() => {})}
          />
        );
      },
    },
    {
      accessorKey: "productType",
      header: "Product Type",
      cell: ({ row }) => {
        const productType = row.getValue("productType") as string;
        return (
          <Badge variant={PRODUCT_TYPE_VARIANTS[productType as keyof typeof PRODUCT_TYPE_VARIANTS] || "default"}>
            {productType.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: "productVariations",
      header: "Variations",
      cell: ({ row }) => {
        const variations = row.getValue("productVariations") as any[];
        if (!variations || variations.length === 0) {
          return <p className="text-xs text-gray-500">No variations</p>;
        }
        return (
          <div className="text-xs">
            <p className="font-medium">{variations.length} variation(s)</p>
            <div className="text-gray-500 space-y-1">
              {variations.slice(0, 2).map((variation, index) => (
                <div key={index} className="truncate max-w-48">
                  {variation.name} - ${variation.currentPrice}
                </div>
              ))}
              {variations.length > 2 && (
                <p className="text-gray-400">+{variations.length - 2} more...</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const formattedDate = new Date(
          row.getValue("createdAt")
        ).toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        return <p className="text-xs font-medium">{formattedDate}</p>;
      },
    },
  ];
}

export function organizationProductColumns(): ColumnDef<ProductDetails>[] {
  return [
    {
      accessorKey: "description",
      header: "Product Name",
      cell: ({ row }) => {
        return (
          <Link to="#" className="font-medium text-[#008CE3] ">
            {row.getValue("description")}
          </Link>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "product",
      header: "Product Title",
      cell: ({ row }) => {
        const product = row.getValue("product") as any;
        return (
          <div>
            <p className="text-xs font-medium">{product?.title || 'N/A'}</p>
            <p className="text-[10px] text-slate-400">{product?.key || ''}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "strength",
      header: "Strength",
      cell: ({ row }) => {
        return <p className="text-xs font-medium">{row.getValue("strength")}</p>;
      },
    },
    {
      accessorKey: "form",
      header: "Form",
      cell: ({ row }) => {
        const form = row.getValue("form") as string;
        const formVariants = {
          "Oral": "default",
          "Injection": "secondary",
          "topical": "outline",
        } as const;
        return (
          <Badge variant={formVariants[form as keyof typeof formVariants] || "default"} className="capitalize">
            {form}
          </Badge>
        );
      },
    },
    {
      accessorKey: "pricePerUnit",
      header: "Price Per Unit",
      cell: ({ row }) => {
        const price = Number(row.getValue("pricePerUnit")) || 0;
        return <p className="text-xs font-medium">${price.toFixed(2)}</p>;
      },
    },
    {
      accessorKey: "typicalDuration",
      header: "Duration (Days)",
      cell: ({ row }) => {
        const duration = row.getValue("typicalDuration") as number;
        return <p className="text-xs font-medium">{duration} days</p>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "secondary" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const formattedDate = new Date(
          row.getValue("createdAt")
        ).toLocaleDateString("en-US");
        return <p className="text-xs font-medium">{formattedDate}</p>;
      },
    },
    // {
    //   accessorKey: "id",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     return (
    //       <Link
    //         to={`/products/${row.getValue("id")}`}
    //         className="flex justify-center items-center py-1 px-5 w-[85px] h-[36px] rounded-[50px] border border-primary-foreground"
    //       >
    //         View
    //       </Link>
    //     );
    //   },
    // },
  ];
}