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
import type { PatientDetail } from "@/types/responses/patient";
import { useDeleteNoteMutation, type Note } from "@/redux/services/notes";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface NotesProps {
  patient: PatientDetail;
}

const Notes = ({ patient }: NotesProps) => {
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>(patient?.notes || []);
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  useEffect(() => {
    setNotes(patient?.notes || []);
  }, [patient?.notes]);

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;

    try {
      await deleteNote(deleteNoteId).unwrap();
      // Remove the note from local state
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== deleteNoteId)
      );
      toast.success("Note deleted successfully!");
      setDeleteNoteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete note");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div
      id="notesInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-4">
        <div className="flex gap-2 items-center">
          <NotesSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold">Notes</h1>
        </div>
        <Button
          onClick={() => {}}
          className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 mx-1" />
          ADD NOTE
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-sm text-gray-500">No notes available</div>
          </div>
        ) : (
          notes.map((note: Note) => (
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
                    {formatDate(note.createdAt)}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6 hover:bg-red-100 cursor-pointer"
                        onClick={() => setDeleteNoteId(note._id)}
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
          ))
        )}
      </div>
    </div>
  );
};
export default Notes;
