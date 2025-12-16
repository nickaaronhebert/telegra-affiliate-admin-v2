import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const UPLOADER_FILE_FORMATS = {
  PDF: '.pdf',
  PNG: '.png',
  JPEG: '.jpeg',
  JPG: '.jpg',
  DOCX: '.docx',
} as const;

interface IFile {
  url: string;
  name: string;
  format: string;
}

interface UploadProps {
  file: IFile;
  onClick: () => void;
}

export const Upload = ({ file, onClick }: UploadProps) => {
  const fileFormat = file.format.toLowerCase();
console.log('Rendering upload for file format:', fileFormat,UPLOADER_FILE_FORMATS,file);
  switch (fileFormat) {
    case UPLOADER_FILE_FORMATS.PDF:
      return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-900 truncate">{file.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(file.url, '_blank')}
          >
            Open
          </Button>
        </div>
      );

    case UPLOADER_FILE_FORMATS.PNG:
    case UPLOADER_FILE_FORMATS.JPEG:
    case UPLOADER_FILE_FORMATS.JPG:
      return (
        <div className="space-y-2">
          <div
            className="cursor-pointer border rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={onClick}
          >
            <img
              src={file.url}
              alt={file.name}
              className="w-48 h-32 object-cover"
            />
          </div>
          <div className="text-sm text-gray-600 truncate max-w-48">
            {file.name}
          </div>
        </div>
      );

    case UPLOADER_FILE_FORMATS.DOCX:
      return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-900 truncate">{file.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          </Button>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-900 truncate">{file.name}</span>
          </div>
          <span className="text-xs text-gray-500">Unsupported format</span>
        </div>
      );
  }
};