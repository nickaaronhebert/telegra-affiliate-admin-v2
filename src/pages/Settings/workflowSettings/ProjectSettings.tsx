import React from "react";
import { useGetProjectsQuery } from "@/redux/services/projects";
import { Badge } from "@/components/ui/badge";
import { PAYMENT_MECHANISMS } from "@/constants";

export default function ProjectSettingsSection({
  sectionRef,
}: {
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  // Get the default project or first project
  const project = projects.find((p) => p.default) || projects[0];

  if (isLoading) {
    return (
      <div
        ref={sectionRef}
        id="projects"
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Settings
          </h2>
        </div>
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          Loading project settings...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        ref={sectionRef}
        id="projects"
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Settings
          </h2>
        </div>
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No projects found
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      id="projects"
      className="bg-white rounded-lg mb-8 overflow-hidden mt-6"
      style={{ boxShadow: "0px 2px 40px 0px hsla(0, 0%, 0%, 0.08)" }}
    >
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <div className="text-lg font-semibold">Default Projects</div>
        {(project.paymentMechanism ?? PAYMENT_MECHANISMS.PatientPay) && (
          <Badge variant="patient" className="p-1">
            PATIENT PAY
          </Badge>
        )}
        {(project.default ?? true) && (
          <Badge variant="defaultSecondary" className="p-1">
            DEFAULT
          </Badge>
        )}
      </div>

      <div className="px-6 py-6 space-y-6 ">
        {/* General Settings */}
        <div className="space-y-4 bg-light-background rounded-md p-4 border-card-border border">
          <div className="space-y-3">
            <SettingRow
              label="Account Creation"
              value="Not allowed"
              valueColor="text-red-600"
            />
            <SettingRow
              label="Process Order Payment for Affiliate"
              value={
                project.paymentStrategy.processOrderPaymentForAffiliate
                  ? "Yes"
                  : "No"
              }
              valueColor={
                project.paymentStrategy.processOrderPaymentForAffiliate
                  ? "text-green-600"
                  : "text-gray-600"
              }
            />
            <SettingRow
              label="Waiting Room"
              value={project.waitingRoomRequired ? "Yes" : "No"}
              valueColor={
                project.waitingRoomRequired ? "text-green-600" : "text-gray-600"
              }
            />
            <SettingRow
              label="Order Auto-Submission"
              value={project.orderAutoSubmissionEnabled ? "Yes" : "No"}
              valueColor={
                project.orderAutoSubmissionEnabled
                  ? "text-green-600"
                  : "text-gray-600"
              }
            />
            <SettingRow
              label="Send automated reminders to patients"
              value="No"
              valueColor="text-gray-600"
            />
            <SettingRow
              label="Requires approval"
              value="No"
              valueColor="text-gray-600"
            />
            <SettingRow
              label="Override"
              value="No Override"
              valueColor="text-gray-600"
            />
            <SettingRow
              label="Synchronous Visits"
              value={`$${project.paymentStrategy.synchronousBillPriceToUser.toFixed(
                2
              )}`}
              valueColor="text-gray-900"
            />
            <SettingRow
              label="Asynchronous Visits"
              value={`$${project.paymentStrategy.asynchronousBillPriceToUser.toFixed(
                2
              )}`}
              valueColor="text-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

function SettingRow({ label, value }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between px-3 rounded-md">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium`}>{value}</span>
    </div>
  );
}
