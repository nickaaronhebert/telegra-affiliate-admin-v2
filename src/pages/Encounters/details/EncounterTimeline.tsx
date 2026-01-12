import TimelineSvg from "@/assets/icons/Timeline";
import type {
  EncounterDetail,
  EncounterEvent,
} from "@/types/responses/encounter";
import dayjs from "@/lib/dayjs";
import { CheckCircle2 } from "lucide-react";

interface EncounterTimelineProps {
  encounter: EncounterDetail;
}

const EncounterTimeline = ({ encounter }: EncounterTimelineProps) => {
  const history = encounter?.history || [];
  const isCurrentEvent = (index: number) => index === 0; // Latest event is current

  return (
    <div
      id="encounterTimelineInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-4">
        <div className="flex gap-2 items-center">
          <TimelineSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold">Timeline</h1>
        </div>
      </div>
      <div className="mt-4 space-y-4 overflow-y-auto rounded-lg h-[350px] pr-2">
        {history.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-sm text-gray-500">No timeline events</div>
          </div>
        ) : (
          history.map((event: EncounterEvent, index: number) => (
            <div
              key={event.id}
              className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
            >
              {/* Timeline Icon */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {event.eventTitle}
                    </h3>
                    {event.eventDescription && (
                      <p className="text-xs text-gray-600 mt-1">
                        {event.eventDescription}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {dayjs(event.createdAt).format("MMM DD, YYYY, h:mm A")}
                  </p>
                  {/* Current Stage Badge */}
                </div>

                {/* Timestamp */}

                {isCurrentEvent(index) && (
                  <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lilac text-primary whitespace-nowrap">
                    Current Stage
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default EncounterTimeline;
