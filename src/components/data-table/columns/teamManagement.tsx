import type { ColumnDef } from "@tanstack/react-table";
import {
  useUpdateTeamManagementMutation,
  type AffiliateAdminDetails,
} from "@/redux/services/teamManagement";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/Dialog";
import { toast } from "sonner";
import ManageTeam from "@/pages/TeamManagement/ManageTeam";
import { SquarePen } from "lucide-react";

export function teamManagementColumns(): ColumnDef<AffiliateAdminDetails>[] {
  return [
    {
      accessorKey: "name",
      header: "Member",

      cell: ({ row }) => {
        const { name, email } = row.original;
        return (
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs font-normal text-slate">{email}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const { role } = row.original;
        return <Badge className="py-1 px-2">{role}</Badge>;
      },
    },

    {
      accessorKey: "phone",
      header: "Phone ",

      cell: ({ row }) => {
        const { phone } = row.original;
        return <p className="font-normal text-xs">{phone}</p>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status } = row.original;
        return <Badge className="py-1 px-2">{status}</Badge>;
      },
    },

    {
      id: "status-switch",
      cell: ({ row }) => {
        const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
        const { id, firstName, lastName, phone, email, role, status, name } =
          row.original;
        const [updateAffiliateAdmin, { isLoading }] =
          useUpdateTeamManagementMutation();
        return (
          <>
            <Switch
              checked={status === "active"}
              onCheckedChange={() => setIsActiveModalOpen(true)}
            />

            <ConfirmDialog
              isLoading={isLoading}
              open={isActiveModalOpen}
              onOpenChange={setIsActiveModalOpen}
              title={ status === "active" ? `Deactivate ${name}` : `Activate ${name}`}
              description={
                status === "active"
                  ? `This action will deactivate ${name}`
                  : `This action will activate ${name}`
              }
              onConfirm={async () => {
                await updateAffiliateAdmin({
                  id,
                  firstName,
                  lastName,
                  phone,
                  email,
                  role,
                  status: status === "active" ? "inactive" : "active",
                })
                  .unwrap()
                  .then(() => {
                    toast.success("Details Updated Successfully", {
                      duration: 1500,
                    });
                    setIsActiveModalOpen(false);
                  })
                  .catch((err) => {
                    console.log("error", err);
                    toast.error("Something went wrong", {
                      duration: 1500,
                    });
                  });
              }}
              cancelText="Cancel"
              cancelTextVariant={"ctrl"}
              confirmTextVariant={"ctrl"}
              confirmTextClass={`min-w-[110px] min-h-[40px]  rounded-[50px] ${
                status === "active"
                  ? "bg-destructive text-white"
                  : "bg-green-400 text-white"
              }`}
              cancelTextClass="min-w-[110px] min-h-[40px] bg-white text-black border border-border rounded-[50px]"
              confirmText={status === "active" ? "Deactivate" : "Activate"}
            />
          </>
        );
      },
    },

    {
      id: "edit-details",
      cell: ({ row }) => {
        const [updateUser, { isLoading }] = useUpdateTeamManagementMutation();
        const [openEditMemberModal, setOpenEditMemberModal] = useState(false);
        const { firstName, lastName, email, phone, role, id } = row.original;

        return (
          <>
            <SquarePen
              size={18}
              className="cursor-pointer"
              stroke="#5456AD"
              onClick={() => setOpenEditMemberModal(true)}
            />

            <ConfirmDialog
              open={openEditMemberModal}
              onOpenChange={setOpenEditMemberModal}
              title={`Edit User`}
              onConfirm={() => {}}
              showFooter={false}
            >
              <ManageTeam
                action={updateUser}
                successMessage="Details Updated Successfully"
                isLoading={isLoading}
                setClose={setOpenEditMemberModal}
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                role={role}
                id={id}
                confirmText={"Update"}
              />
            </ConfirmDialog>
          </>
        );
      },
    },
  ];
}
