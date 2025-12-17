import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
    useViewAllTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} from "@/redux/services/tagManagement";
import TagSVG from "@/assets/icons/Tag";
import { BlueEdit } from "@/assets/icons/BlueEdit";
import { Delete } from "@/assets/icons/Delete";
import type { ITag } from "@/types/responses/tag";
import type {
    ICreateTagRequest,
    IUpdateTagRequest,
} from "@/types/requests/tag";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const COLOR_OPTIONS = [
    { label: "Red", text: "#C41E3A", background: "#FFA39E" },
    { label: "Volcano", text: "#f5222d", background: "#FFBB96" },
    { label: "Orange", text: "#D67315", background: "#FFD591" },
    { label: "Gold", text: "#faad14", background: "#FFE89A" },
    { label: "Lime", text: "#7FB40A", background: "#EAFF8F" },
    { label: "Green", text: "#5BA43B", background: "#C7F0A7" },
    { label: "Cyan", text: "#35ACAF", background: "#87E8DE" },
    { label: "Blue", text: "#1890ff", background: "#DCF3FF" },
];

export default function TagManagementSection({
    sectionRef,
}: {
    sectionRef?: React.RefObject<HTMLDivElement | null>;
}) {
    const { data: tags = [], isLoading } = useViewAllTagsQuery();
    const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
    const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
    const [deleteTag] = useDeleteTagMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<ITag | null>(null);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ isOpen: boolean; tag: ITag | null }>({
        isOpen: false,
        tag: null,
    });

    // Helper function to get id based on owner model
    const getIdByOwnerModel = (model: string): string => {
        if (model === "user" || model === "User") {
            const userTag = tags.find(t => t.scope.owner.model === "User");
            return userTag?.scope.owner.id || "";
        } else {
            const affiliateTag = tags.find(t => t.scope.owner.model === "Affiliate");
            return affiliateTag?.scope.owner.id || "";
        }
    };

    const [form, setForm] = useState<ICreateTagRequest>({
        name: "",
        description: "",
        color: COLOR_OPTIONS[0].text,
        scope: {
            targetModel: "Order",
            owner: {
                model: "affiliate",
                id: "",
            },
        },
    });

    /** Auto-fill owner id only for create mode */
    useEffect(() => {
        if (!editingTag && !form.scope.owner.id && tags.length > 0) {
            setForm((f: ICreateTagRequest) => ({
                ...f,
                scope: {
                    ...f.scope,
                    owner: {
                        ...f.scope.owner,
                        id: tags[0].scope.owner.id,
                    },
                },
            }));
        }
    }, [tags, editingTag]);

    const openCreate = () => {
        setEditingTag(null);
        setForm({
            name: "",
            description: "",
            color: COLOR_OPTIONS[0].text,
            scope: {
                targetModel: "Order",
                owner: {
                    model: "affiliate",
                    id: tags[0]?.scope.owner.id || "",
                },
            },
        });
        setIsDialogOpen(true);
    };

    const openEdit = (tag: ITag) => {
        setEditingTag(tag);
        setForm({
            name: tag.name,
            description: tag.description || "",
            color: tag.color,
            scope: {
                ...tag.scope,
                owner: {
                    ...tag.scope.owner,
                    model: tag.scope.owner.model.toLowerCase(),
                },
            },
        });
        setIsDialogOpen(true);
    };
    const handleDelete = async (tag: ITag) => {
        setDeleteConfirmDialog({ isOpen: true, tag });
    };

    const confirmDelete = async () => {
        const tag = deleteConfirmDialog.tag;
        if (!tag?.id) return;

        try {
            await deleteTag(tag.id).unwrap();
            toast.success("Tag deleted");
            setDeleteConfirmDialog({ isOpen: false, tag: null });
        } catch {
            toast.error("Failed to delete tag");
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingTag?.id) {
                const payload: IUpdateTagRequest = {
                    id: editingTag.id,
                    name: form.name,
                    color: form.color,
                    description: form.description,
                    scope: {
                        ...form.scope,
                        owner: {
                            ...form.scope.owner,
                            model: form.scope.owner.model === "affiliate" ? "Affiliate" : "User",
                        },
                    },
                };
                await updateTag(payload).unwrap();
                toast.success("Tag updated");
            } else {
                const createPayload: ICreateTagRequest = {
                    ...form,
                    scope: {
                        ...form.scope,
                        owner: {
                            ...form.scope.owner,
                            model: form.scope.owner.model === "affiliate" ? "Affiliate" : "User",
                        },
                    },
                };
                await createTag(createPayload).unwrap();
                toast.success("Tag created");
            }

            setIsDialogOpen(false);
        } catch {
            toast.error("Failed to save tag");
        }
    };

    return (
        <>
            {/* Tags Section */}
            <div
                ref={sectionRef}
                id="tags"
                className="bg-white rounded-lg mb-8 overflow-hidden"
                style={{
                    boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
                }}
            >
                <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
                    <h2 className="text-base font-semibold">Tag Management</h2>
                    <Button
                        size="sm"
                        onClick={openCreate}
                        disabled={isCreating || isUpdating}
                        className="flex bg-black text-white text-[10px] font-semibold w-[70px] h-[28px] rounded-[4px] pointer hover:bg-gray-800"
                    >
                        <Plus />
                        <span>ADD</span>
                    </Button>
                </div>


                <div className="p-4 space-y-3">
                    {isLoading && <div className="py-8 text-center text-sm text-muted-foreground">Loading tags...   </div>}

                    {!isLoading && tags.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">No tags yet. Create one to get started.</div>
                    )}

                    {tags.map((tag: ITag) => (
                        <div
                            key={tag.id}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#F6FAFF] hover:shadow-sm transition-shadow p-4"
                        >
                            {/* Left section with color and content */}
                            <div className="flex items-center gap-3 flex-1">
                                <div className="bg-[#CCE5FF] p-2.5 rounded-md flex items-center justify-center">
                                    <TagSVG />
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm">[{tag.name}]</span>

                                        <Badge variant={tag.scope.owner.model === "User" ? "user" : "affiliate"}>
                                            {tag.scope.owner.model}
                                        </Badge>
                                        <span className="text-[10px] text-queued">Type: Order</span>
                                    </div>

                                    {tag.description && (
                                        <p className="text-[10px] text-[#3E4D61] mt-1">
                                            {tag.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                <button
                                    onClick={() => openEdit(tag)}
                                    className="pointer"
                                    title="Edit tag"
                                >
                                    <BlueEdit />
                                </button>

                                <button
                                    onClick={() => handleDelete(tag)}
                                    className="pointer"
                                    title="Delete tag"
                                >
                                    <Delete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md p-6 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            {editingTag ? "Edit Tag" : "Create New Tag"}
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        {/* Tag Name */}
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Tag Name</Label>
                            <Input
                                placeholder="Enter tag name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((s: ICreateTagRequest) => ({
                                        ...s,
                                        name: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        {/* Color */}
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Color</Label>
                            <Select
                                value={form.color}
                                onValueChange={(v) =>
                                    setForm((s: ICreateTagRequest) => ({ ...s, color: v }))
                                }
                            >
                                <SelectTrigger className="pointer w-full">
                                    {form.color ? (
                                        (() => {
                                            const selected = COLOR_OPTIONS.find(c => c.text === form.color);
                                            return selected ? (
                                                <div
                                                    className="flex items-center w-full rounded gap-2"
                                                >
                                                    <span
                                                        className="text-xs font-semibold border rounded px-2 py-0.5"
                                                        style={{
                                                            color: selected.text,
                                                            borderColor: selected.text,
                                                        }}
                                                    >
                                                        Sample
                                                    </span>
                                                    <span className="text-sm font-medium">{selected.label}</span>
                                                </div>
                                            ) : (
                                                <SelectValue placeholder="Select a color" className="pointer" />
                                            );
                                        })()
                                    ) : (
                                        <SelectValue placeholder="Select a color" className="pointer" />
                                    )}
                                </SelectTrigger>
                                <SelectContent className="pointer">
                                    {COLOR_OPTIONS.map((c) => (
                                        <SelectItem
                                            key={c.text}
                                            value={c.text}
                                            className="w-full p-0"
                                        >
                                            <div
                                                className="flex items-center justify-between w-full px-3 py-2 rounded gap-2"
                                                style={{
                                                    // backgroundColor: c.background,
                                                    // color: c.text,
                                                }}
                                            >

                                                <span
                                                    className="text-xs font-semibold border rounded px-2 py-0.5"
                                                    style={{
                                                        color: c.text,
                                                        borderColor: c.text,
                                                        backgroundColor: c.background,
                                                    }}
                                                >
                                                    Sample
                                                </span>
                                                <span className="text-sm font-medium">{c.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Owner Model */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Owner Model {editingTag && "(Cannot be changed)"}</Label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    disabled={!!editingTag}
                                    onClick={() => {
                                        const affiliateId = getIdByOwnerModel("affiliate");
                                        setForm((s: ICreateTagRequest) => ({
                                            ...s,
                                            scope: {
                                                ...s.scope,
                                                owner: {
                                                    model: "affiliate",
                                                    id: affiliateId,
                                                },
                                            },
                                        }));
                                    }}
                                    className={`px-4 py-2 rounded border-2 font-medium transition-all ${
                                        form.scope.owner.model === "affiliate"
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                    } ${editingTag ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    Affiliate
                                </button>
                                <button
                                    type="button"
                                    disabled={!!editingTag}
                                    onClick={() => {
                                        const userId = getIdByOwnerModel("user");
                                        setForm((s: ICreateTagRequest) => ({
                                            ...s,
                                            scope: {
                                                ...s.scope,
                                                owner: {
                                                    model: "user",
                                                    id: userId,
                                                },
                                            },
                                        }));
                                    }}
                                    className={`px-4 py-2 rounded border-2 font-medium transition-all ${
                                        form.scope.owner.model === "user"
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                    } ${editingTag ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    User
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Description</Label>
                            <Input
                                placeholder="Optional description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm((s: ICreateTagRequest) => ({
                                        ...s,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/5"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                {editingTag ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmDialog.isOpen} onOpenChange={(isOpen) => 
                setDeleteConfirmDialog({ ...deleteConfirmDialog, isOpen })
            }>
                <DialogContent className="sm:max-w-md p-6 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Delete Tag
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete the tag <span className="font-semibold">"{deleteConfirmDialog.tag?.name}"</span>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                onClick={() => setDeleteConfirmDialog({ isOpen: false, tag: null })}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
