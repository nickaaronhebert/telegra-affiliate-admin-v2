import NotesSvg from "@/assets/icons/Notes";
import { Button } from "@/components/ui/button";
import type { PatientDetail } from "@/types/responses/patient";
import { useDeleteNoteMutation, type Note } from "@/redux/services/notes";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NoteDetailCard from "@/components/common/NoteDetailCard/NoteDetailCard";

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
            <NoteDetailCard
              key={note._id}
              note={note}
              setDeleteNoteId={setDeleteNoteId}
              handleDeleteNote={handleDeleteNote}
              isDeleting={isDeleting}
              stripHtml={stripHtml}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default Notes;
