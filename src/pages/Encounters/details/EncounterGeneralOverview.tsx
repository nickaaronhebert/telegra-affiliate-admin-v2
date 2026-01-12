import GeneralOverviewSvg from "@/assets/icons/GeneralOverview";
import { PAYMENT_MECHANISMS_TITLE } from "@/constants";
import type { EncounterDetail } from "@/types/responses/encounter";
import dayjs from "@/lib/dayjs";
import { getStatusColors } from "@/lib/utils";

interface EncounterGeneralOverviewProps {
  encounter: EncounterDetail;
}

const EncounterGeneralOverview = ({
  encounter,
}: EncounterGeneralOverviewProps) => {
  return (
    <div
      id="generalOverview"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border pb-4 justify-between">
        <div className="flex gap-2 ">
          <GeneralOverviewSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">General Overview</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4  pb-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p
              className={`w-fit px-3 py-1 rounded-l text-xs font-medium uppercase  ${
                getStatusColors(encounter?.status).badge
              }`}
            >
              {getStatusColors(encounter?.status).label}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Payment</label>
            <p className="text-sm font-normal capitalize">
              {PAYMENT_MECHANISMS_TITLE[encounter?.project?.paymentMechanism]}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Date</label>
            <p className="text-sm font-normal">
              {dayjs(encounter?.createdAt).format("MMMM D, YYYY")}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Project</label>
            <p className="text-sm font-normal capitalize">
              {encounter?.project?.title || "-"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Patient</label>
            <p className="text-sm font-normal">
              {encounter?.patient?.firstName} {encounter?.patient?.lastName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncounterGeneralOverview;
