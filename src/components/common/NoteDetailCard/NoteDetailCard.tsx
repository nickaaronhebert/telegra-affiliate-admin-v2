import NotesSvg from "@/assets/icons/Notes";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type Note } from "@/redux/services/notes";
import { Trash2 } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { type FC } from "react";

interface NoteDetailCardProps {
  note: Note;
  setDeleteNoteId: (id: string | null) => void;
  handleDeleteNote: () => Promise<void>;
  isDeleting: boolean;
  stripHtml: (html: string) => string;
}

const NoteDetailCard: FC<NoteDetailCardProps> = ({
  note,
  setDeleteNoteId,
  handleDeleteNote,
  isDeleting,
  stripHtml,
}) => {
  return (
    <div
      key={note._id}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 relative"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          <div className="rounded flex items-center justify-center">
            <NotesSvg color="#854D0E" width={14} height={14} />
          </div>
          <span className="font-medium text-xl text-gray-900">
            {note.owner.name ||
              note.owner.fullName ||
              `${note.owner.firstName} ${note.owner.lastName}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {dayjs(note.createdAt).format("MMMM D, YYYY")}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 hover:bg-red-100 cursor-pointer"
                onClick={() => setDeleteNoteId(note?._id || note?.id)}
              >
                <Trash2 className="w-3 h-3 text-primary" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                <AlertDialogDescription>
                  Sure you want to delete this note?
                  <br />
                  Remember you can't undo this.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDeleteNoteId(null)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  Keep it
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteNote}
                  disabled={isDeleting}
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed pl-4">
        {stripHtml(note.content.standardText)}
      </div>
    </div>
  );
};

export default NoteDetailCard;
