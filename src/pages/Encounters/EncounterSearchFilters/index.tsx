import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { useViewAffiliateAdminQuery } from "@/redux/services/teamManagement";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { useViewAllEncounterProductsQuery } from "@/redux/services/product";
import { BriefcaseMedical } from "lucide-react";
import { useViewAllTagsQuery } from "@/redux/services/tagManagement";
import type { SearchFiltersProps } from "..";
import type { Dispatch, SetStateAction } from "react";

interface EncounterSearchFiltersProps {
  setFilters: Dispatch<SetStateAction<SearchFiltersProps | null>>;
  filters: SearchFiltersProps | null;
}

function AdminList({ setFilters, filters }: EncounterSearchFiltersProps) {
  const { data, isLoading, isFetching } = useViewAffiliateAdminQuery();

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="flex justify-center min-h-50 items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-h-100 overflow-y-auto space-y-1.5 mt-4">
          {data?.map((item) => {
            return (
              <div
                className={cn(
                  "flex items-center gap-3 py-1.5 px-3   cursor-pointer",
                  filters && filters?.adminId === item.id
                    ? "bg-primary text-white"
                    : "bg-[#F6F8FB]"
                )}
                key={item.id}
                onClick={() => {
                  setFilters((prev) => ({
                    ...(prev ?? {}),
                    adminId: item.id,
                    adminTitle: item.name,
                  }));
                }}
              >
                <UserRound size={14} />
                <span className={cn("text-sm font-medium")}>{item?.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductList({ setFilters, filters }: EncounterSearchFiltersProps) {
  const user = localStorage.getItem("user");
  const affiliate = user ? JSON.parse(user)?.affiliate : "";
  const { data, isLoading, isFetching } = useViewAllEncounterProductsQuery({
    page: 1,
    perPage: 100,
    q: "",
    affiliate,
  });

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="flex justify-center min-h-50 items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-h-100 overflow-y-auto space-y-1.5 mt-4">
          {data?.map((item) => {
            return (
              <div
                className={cn(
                  "flex items-center gap-3 py-1.5 px-3  bg-[#F6F8FB] cursor-pointer",
                  filters && filters?.productId === item.id
                    ? "bg-[#F6FFED] text-[#5FB23B]"
                    : "bg-[#F6F8FB]"
                )}
                key={item.id}
                onClick={() => {
                  setFilters((prev) => ({
                    ...(prev ?? {}),
                    productId: item.id,
                    productTitle: item.title,
                  }));
                }}
              >
                <BriefcaseMedical size={14} stroke="#5FB23B" />
                <span className="text-sm font-medium">{item?.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TagsList({ setFilters }: EncounterSearchFiltersProps) {
  const { data, isLoading, isFetching } = useViewAllTagsQuery();

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="flex justify-center min-h-50 items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-h-100 overflow-y-auto space-y-1.5 mt-4">
          {data?.map((item) => {
            return (
              <div
                className="flex items-center gap-3 py-1.5 px-3 cursor-pointer"
                key={item.id}
                onClick={() => {
                  setFilters((prev) => ({
                    ...(prev ?? {}),
                    tagId: item.id,
                    tagTitle: item.name,
                  }));
                }}
              >
                <span
                  style={{ backgroundColor: item?.color }}
                  className={cn(
                    "text-sm font-medium p-2 rounded-md min-w-21.75 text-center"
                  )}
                >
                  {item?.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EncounterSearchFilters({
  setFilters,
  filters,
}: EncounterSearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tags");
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Button */}
      <div
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
        className={cn(
          "cursor-pointer text-sm font-normal text-[#63627F] min-w-82.5 border py-3 px-3.5 rounded-[6px]  bg-white flex justify-between items-center"
        )}
      >
        Search tags, admin, product...
        <ChevronDown className="h-4 w-4" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full p-5 z-50 min-w-82.5  rounded-md border bg-white shadow-lg">
          <div className="flex justify-around">
            <span
              onClick={() => setActiveTab("tags")}
              className={cn(
                "min-w-25.5 py-1.5 px-2.5 font-semibold text-sm text-center cursor-pointer",
                activeTab === "tags"
                  ? "text-primary border-b-2 border-primary"
                  : "border-b-2 border-b-muted"
              )}
            >
              Tags{" "}
            </span>

            <span
              onClick={() => setActiveTab("admins")}
              className={cn(
                "min-w-25.5 py-1.5 px-2.5 font-semibold text-sm text-center cursor-pointer",
                activeTab === "admins"
                  ? "text-primary border-b-2 border-primary"
                  : "border-b-2 border-b-muted"
              )}
            >
              Admins{" "}
            </span>

            <span
              onClick={() => setActiveTab("products")}
              className={cn(
                "min-w-25.5 py-1.5 px-2.5 font-semibold text-sm text-center cursor-pointer",
                activeTab === "products"
                  ? "text-primary border-b-2 border-primary"
                  : "border-b-2 border-b-muted"
              )}
            >
              Products{" "}
            </span>
          </div>
          <div>
            {activeTab === "admins" && (
              <AdminList setFilters={setFilters} filters={filters} />
            )}
            {activeTab === "products" && (
              <ProductList setFilters={setFilters} filters={filters} />
            )}
            {activeTab === "tags" && (
              <TagsList setFilters={setFilters} filters={filters} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
