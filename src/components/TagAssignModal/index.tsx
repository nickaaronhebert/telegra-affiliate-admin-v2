import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import {
  useGetCompactTagsQuery,
  useAssignTagsMutation,
} from "@/redux/services/tagManagement";
import type { ICompactTag } from "@/types/responses/tag";
import { toast } from "sonner";

interface TagAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  targetModel: string;
  currentTags?: ICompactTag[];
}

export function TagAssignModal({
  isOpen,
  onClose,
  targetId,
  targetName: _targetName,
  targetModel,
  currentTags = [],
}: TagAssignModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { data: availableTags = [], isLoading: isLoadingTags } =
    useGetCompactTagsQuery(
      { targetModel, mode: "compact" },
      { skip: !isOpen }
    );

  const [assignTags, { isLoading: isAssigning }] = useAssignTagsMutation();

  // Initialize selected tags when modal opens or current tags change
  useEffect(() => {
    if (isOpen) {
      setSelectedTagIds(currentTags.map((tag) => tag.id));
      setSearchTerm("");
    }
  }, [isOpen, currentTags]);

  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return availableTags;
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableTags, searchTerm]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    try {
      await assignTags({
        targetModel,
        targetId,
        tagIds: selectedTagIds,
      }).unwrap();
      toast.success("Tags assigned successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign tags");
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedTagIds([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-[320px] p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base font-semibold">
            Assign Tags
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="px-4 pb-4 max-h-[300px] overflow-y-auto">
          {isLoadingTags ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {searchTerm ? "No tags found" : "No tags available"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-3 py-2 px-1 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={selectedTagIds.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <Button
            onClick={handleSave}
            disabled={isAssigning || isLoadingTags}
            className="w-full rounded-md bg-primary text-white font-medium cursor-pointer py-2"
          >
            {isAssigning ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
