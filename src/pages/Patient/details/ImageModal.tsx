import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IFile {
  url: string;
  name: string;
  format: string;
}

interface ImageModalProps {
  file: IFile;
  onCancel: () => void;
}

export const ImageModal = ({ file, onCancel }: ImageModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="truncate">{file.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};