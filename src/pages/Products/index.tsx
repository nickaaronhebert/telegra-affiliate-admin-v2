import { ecommerceProductColumns } from "@/components/data-table/columns/product";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useViewAllEcommerceProductsQuery } from "@/redux/services/product";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import type { EcommerceProduct } from "@/types/responses/ecommerceProducts";
import type { ICompactTag } from "@/types/responses/tag";
import { PRODUCT_TYPES } from "@/constants";
import { Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { TagAssignModal } from "@/components/TagAssignModal";

interface TagModalState {
  isOpen: boolean;
  targetId: string;
  targetName: string;
  currentTags: ICompactTag[];
}

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("per_page") ?? "20", 10);
  const name = searchParams.get("name") ?? "";
  const productType = searchParams.get("productType") ?? "";
  const { data, isLoading, isFetching } = useViewAllEcommerceProductsQuery({
    page,
    limit,
    ...(name && { name }),
    ...(productType && { productType }),
  });

  const [tagModal, setTagModal] = useState<TagModalState>({
    isOpen: false,
    targetId: "",
    targetName: "",
    currentTags: [],
  });

  const handleAssignTags = useCallback(
    (productId: string, productName: string, tags: ICompactTag[]) => {
      setTagModal({
        isOpen: true,
        targetId: productId,
        targetName: productName,
        currentTags: tags,
      });
    },
    []
  );

  const handleCloseTagModal = useCallback(() => {
    setTagModal({
      isOpen: false,
      targetId: "",
      targetName: "",
      currentTags: [],
    });
  }, []);

  const columns = useMemo(
    () => ecommerceProductColumns(handleAssignTags),
    [handleAssignTags]
  );

  const filterFields: DataTableFilterField<EcommerceProduct>[] = [
    {
      label: "Product Name",
      value: "name",
      placeholder: "Search By Product Name",
    },
    {
      label: "Product Type",
      value: "productType",
      placeholder: "Filter By Product Type",
      options: Object.entries(PRODUCT_TYPES).map(([, value]) => ({
        label: value.replace(/_/g, " "),
        value: value,
      })),
    },
  ];

  const { table } = useDataTable({
    data: !(isLoading || isFetching) ? data?.products || [] : [],
    columns: columns,
    filterFields,
    pageCount: Math.ceil((data?.count || 0) / limit),
  });

  return (
    <div className="w-full min-w-0">
      <div className="lg:p-3.5">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Products</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-5 items-stretch sm:items-center">
            <div className="flex-1 min-w-0">
              <DataTableToolbar
                table={table}
                filterFields={filterFields}
                className="mb-2"
              />
            </div>

            <Button
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
              onClick={() => navigate(ROUTES.PRODUCTS_CREATE)}
            >
              <Plus /> Add Product
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-hidden">
        <DataTable table={table} isLoading={isLoading} />
        <DataTablePagination table={table} totalRows={data?.count}/>
      </div>

      <TagAssignModal
        isOpen={tagModal.isOpen}
        onClose={handleCloseTagModal}
        targetId={tagModal.targetId}
        targetName={tagModal.targetName}
        targetModel="EcommerceProduct"
        currentTags={tagModal.currentTags}
      />
    </div>
  );
}
