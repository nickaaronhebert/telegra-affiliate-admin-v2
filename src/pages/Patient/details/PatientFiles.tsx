import DocumentSvg from "@/assets/icons/Document";
import DownloadSvg from "@/assets/icons/Download";
import FilesSvg from "@/assets/icons/Files";
import { Button } from "@/components/ui/button";
import { useUploadPatientFileMutation } from "@/redux/services/patient";
import type { PatientDetail } from "@/types/responses/patient";
import { toast } from "sonner";
import { useMemo, useRef } from "react";
import NoData from "@/assets/icons/NoData";

interface PatientFilesProps {
  patient: PatientDetail;
}

const PatientFiles = ({ patient }: PatientFilesProps) => {
  const [uploadPatientFile, { isLoading: isUploading }] =
    useUploadPatientFileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        try {
          await uploadPatientFile({
            patientId: patient.id,
            data: {
              fileData: fileData,
              fileName: file.name,
            },
          }).unwrap();

          toast.success("File uploaded successfully!");

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to upload file");
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error("Failed to read file");
    }
  };
  const containerHeight = useMemo(() => {
    return patient?.files?.length ? "h-[350px]" : "h-[200px]";
  }, [patient?.files?.length]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      id="patientFilesInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle">
        <div className="flex gap-2 items-center">
          <FilesSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Patient Files</h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="rounded-lg px-4 py-2 cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? "UPLOADING..." : "UPLOAD FILE"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="*/*"
          />
        </div>
      </div>
      <div className="mt-3">
        <div
          className={`bg-white  pb-1 overflow-y-auto rounded-lg ${containerHeight}`}
        >
          {patient?.files?.length > 0 ? (
            <div className="flex flex-col gap-3 mt-4">
              {patient?.files?.map((file) => {
                const handleDownload = () => {
                  window.open(file.url, "_blank");
                };

                return (
                  <div
                    key={file.id}
                    className="p-4 border rounded-lg border-black-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <DocumentSvg />
                      <span>{file.name}</span>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <DownloadSvg />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col gap-2 mt-4">
              <NoData />
              <span className="text-gray-400">No Files Found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PatientFiles;
