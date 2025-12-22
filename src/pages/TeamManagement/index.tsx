import { teamManagementColumns } from "@/components/data-table/columns/teamManagement";
import { Button } from "@/components/ui/button";
import {
  useAddAffiliateAdminMutation,
  useViewAffiliateAdminQuery,
} from "@/redux/services/teamManagement";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";

import {
  useDataTable,
  // type DataTableFilterField,
} from "@/hooks/use-data-table";
import { ConfirmDialog } from "@/components/common/Dialog";
import ManageTeam from "./ManageTeam";
// import { useSearchParams } from "react-router-dom";

export default function TeamManagement() {
  const [addUser, setAddUser] = useState(false);
  const [addMember, { isLoading: addMemberLoading }] =
    useAddAffiliateAdminMutation();
  //   const [searchParams] = useSearchParams();
  //   const page = parseInt(searchParams.get("page") || "1", 10);
  //     const perPage = parseInt(searchParams.get("per_page") ?? "100", 10);

  const {
    data: teamManagementData,
    isLoading,
    isFetching,
  } = useViewAffiliateAdminQuery();
  const columns = useMemo(() => teamManagementColumns(), []);
  const { table } = useDataTable({
    data: teamManagementData || [],
    columns,
    // columns,
    // filterFields,
    pageCount: 1,
  });
  return (
    <div className="p-11.25 ">
      <div className="flex justify-between items-center ">
        <div>
          <h6 className="text-[24px] font-semibold">Team Management</h6>
          <p className="text-lg font-normal">
            Manage your affiliate team members, track performance, and control
            access
          </p>
        </div>

        <Button
          variant="ctrl"
          className="min-w-37.5 min-h-10 py-1.25 px-5 text-sm font-semibold cursor-pointer"
          onClick={() => setAddUser(true)}
        >
          + Add Member
        </Button>
      </div>
      <div className="mt-2.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-3">
        <DataTable table={table} isLoading={isLoading || isFetching} />
        {/* <DataTablePagination table={table} /> */}
      </div>

      <ConfirmDialog
        open={addUser}
        onOpenChange={setAddUser}
        title={`New Member`}
        onConfirm={() => {}}
        showFooter={false}
      >
        <ManageTeam
          action={addMember}
          successMessage="Member Added Successfully"
          isLoading={addMemberLoading}
          setClose={setAddUser}
          confirmText="Create"
        />
      </ConfirmDialog>
    </div>
  );
}
