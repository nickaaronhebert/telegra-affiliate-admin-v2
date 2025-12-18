import { useMemo } from "react";
import type {
  PatientDetail,
  PatientPractitioner,
} from "@/types/responses/patient";
import PractitionersSvg from "@/assets/icons/Practitioners";
import DoctorSvg from "@/assets/icons/Doctor";
import NoData from "@/assets/icons/NoData";

interface PractitionersProps {
  patient: PatientDetail;
}

const Practitioners = ({ patient }: PractitionersProps) => {
  const practitioners: PatientPractitioner[] = useMemo(() => {
    const prescriptionFulfillments = patient?.orders
      .map((order) => order?.prescriptionFulfillments)
      .flat();

    const practitioners = prescriptionFulfillments
      .map((pf) => {
        if (pf?.prescription?.provider?.practitioner) {
          return {
            ...pf?.prescription?.provider?.practitioner,
            picture: pf?.prescription?.provider.picture,
          };
        }
      })
      .filter((x) => x);
    return practitioners as PatientPractitioner[];
  }, [patient]);

  const uniquePractitioners = [
    ...new Map(
      practitioners.map((practitioner) => [practitioner?.id, practitioner])
    ).values(),
  ];

  return (
    <div
      id="practitionersInformation"
      className="bg-white rounded-[10px] shadow-sm p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-2">
        <div className="flex gap-2 items-center">
          <PractitionersSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Practitioners</h1>
        </div>
      </div>
      <div className="mt-3">
        {uniquePractitioners.length > 0 ? (
          <div className="flex gap-4  flex-wrap max-h-[350px] overflow-y-auto">
            {uniquePractitioners?.map((practitioner, index) => (
              <div
                className="w-full max-w-sm p-4 rounded-xl shadow-sm bg-white"
                key={index}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-[50%] border border-primary bg-primary flex justify-center items-center mr-6 overflow-hidden w-[50px] h-[50px]">
                    {practitioner?.picture ? (
                      <img
                        src={practitioner?.picture}
                        alt="practitioner-image"
                      />
                    ) : (
                      <DoctorSvg />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span color="grey">
                      {`${practitioner?.firstName} ${practitioner?.lastName}` ===
                      "Automated Approver"
                        ? "Laboratory Testing Kit Request"
                        : `${practitioner?.firstName} ${practitioner?.lastName}`}
                    </span>
                    <span color="grey">{practitioner?.speciality}</span>
                    <div>
                      <span color="grey">Consultations completed:</span>
                      <span color="grey">
                        {practitioner?.scoring?.visitCount || 0}
                      </span>
                    </div>
                    {practitioner?.licencedState && (
                      <div>
                        <span color="grey">Licensed in:</span>
                        <span color="grey">{practitioner?.licencedState}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col h-[200px] gap-2">
            <NoData />
            <span className="text-gray-400">No practitioners found</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default Practitioners;
