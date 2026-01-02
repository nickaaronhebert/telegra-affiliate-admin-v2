import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import {
  useGetWebhooksListQuery,
  useCreateWebhookMutation,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
  useGetWebhookEventsDictionaryQuery,
} from "@/redux/services/webhooks";
import type {
  IWebhookResponse,
  IWebhookEvent,
} from "@/types/responses/webhook";
import type { IWebhookRequest } from "@/types/requests/webhook";
import { BlueEdit } from "@/assets/icons/BlueEdit";
import { Delete } from "@/assets/icons/Delete";
import { Webhook } from "lucide-react";

/* ---------------- Types (UI-side) ---------------- */
type EventGroup = {
  key: string;
  label: string;
  events: IWebhookEvent[];
};

type WebhookForm = {
  id?: string;
  name: string;
  url: string;
  authentication: boolean;
  credentials: string;
  webhookInterests: string[];
};

const emptyForm: WebhookForm = {
  name: "",
  url: "",
  authentication: false,
  credentials: "",
  webhookInterests: [],
};

const CATEGORY_LABELS: Record<string, string> = {
  order: "Order Events",
  payment: "Payment Events",
  prescription: "Prescription Events",
  shipping: "Shipping Events",
  pharmacy: "Pharmacy Events",
  lab: "Lab Events",
};

export default function WebhookManagement({
  webhookRef,
}: {
  webhookRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { data: webhooksData, isLoading: loadingWebhooks } =
    useGetWebhooksListQuery();
  const { data: eventsData, isLoading: loadingEvents } =
    useGetWebhookEventsDictionaryQuery();
  const [createWebhook, { isLoading: isCreating }] = useCreateWebhookMutation();
  const [updateWebhook, { isLoading: isUpdating }] = useUpdateWebhookMutation();
  const [deleteWebhook] = useDeleteWebhookMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    webhook: IWebhookResponse | null;
  }>({ isOpen: false, webhook: null });
  const [editingWebhook, setEditingWebhook] = useState<IWebhookResponse | null>(
    null
  );
  const [form, setForm] = useState<WebhookForm>(emptyForm);

  // Organize events by category
  const eventGroups = React.useMemo(() => {
    if (!eventsData) return [];

    const groups: Record<string, EventGroup> = {};

    // Initialize all categories
    Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
      groups[key] = { key, label, events: [] };
    });

    // Populate with events
    eventsData.forEach((event) => {
      event.categories.forEach((category) => {
        if (groups[category]) {
          groups[category].events.push(event);
        }
      });
    });

    return Object.values(groups).filter((g) => g.events.length > 0);
  }, [eventsData]);

  const webhooks = webhooksData?.webhooks ?? webhooksData?.result ?? [];

  const openCreate = () => {
    setEditingWebhook(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEdit = (webhook: IWebhookResponse) => {
    setEditingWebhook(webhook);
    setForm({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      authentication: webhook.authentication || false,
      credentials: webhook.credentials || "",
      webhookInterests: webhook.webhookInterests || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (webhook: IWebhookResponse) => {
    setDeleteConfirmDialog({ isOpen: true, webhook });
  };

  const confirmDelete = async () => {
    const webhook = deleteConfirmDialog.webhook;
    if (!webhook?.id) return;

    try {
      await deleteWebhook(webhook.id).unwrap();
      toast.success("Webhook deleted");
      setDeleteConfirmDialog({ isOpen: false, webhook: null });
    } catch {
      toast.error("Failed to delete webhook");
    }
  };

  const toggleEvent = (eventSystemName: string) => {
    setForm((prev) => ({
      ...prev,
      webhookInterests: prev.webhookInterests.includes(eventSystemName)
        ? prev.webhookInterests.filter((e) => e !== eventSystemName)
        : [...prev.webhookInterests, eventSystemName],
    }));
  };

  const removeEvent = (eventSystemName: string) => {
    setForm((prev) => ({
      ...prev,
      webhookInterests: prev.webhookInterests.filter(
        (e) => e !== eventSystemName
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.url.trim()) {
      toast.error("URL is required");
      return;
    }

    if (form.authentication && !form.credentials.trim()) {
      toast.error("Secret token is required for private webhooks");
      return;
    }

    try {
      const payload: IWebhookRequest = {
        name: form.name,
        url: form.url,
        authentication: form.authentication,
        credentials: form.authentication ? form.credentials : undefined,
        webhookInterests: form.webhookInterests,
      };

      if (editingWebhook?.id) {
        await updateWebhook({
          id: editingWebhook.id,
          payload,
        }).unwrap();
        toast.success("Webhook updated");
      } else {
        await createWebhook(payload).unwrap();
        toast.success("Webhook created");
      }

      setIsDialogOpen(false);
      setForm(emptyForm);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to save webhook";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* Webhooks Section */}
      <div
        ref={webhookRef}
        id="webhooks"
        className="bg-white rounded-lg mb-8 overflow-hidden"
        style={{
          boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
        }}
      >
        <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
          <h2 className="text-base font-semibold">Webhook Management</h2>
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
          {loadingWebhooks && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading webhooks...
            </div>
          )}

          {!loadingWebhooks && webhooks.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No webhooks yet. Create one to get started.
            </div>
          )}

          {webhooks.map((webhook: IWebhookResponse) => (
            <div
              key={webhook.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#FFFEF6] hover:shadow-sm transition-shadow p-4"
            >
              {/* Left section with icon and content */}
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-[#FEF9C3] p-2.5 rounded-md flex items-center justify-center">
                  <Webhook size={20} className="#854D0E" />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">
                      {webhook.name}
                    </span>
                    {webhook.authentication && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-[#008CE3] mt-1">
                    {webhook.url}
                  </p>

                  {webhook.webhookInterests &&
                    webhook.webhookInterests.length > 0 && (
                      <div className="text-[10px] text-[#666] mt-2 flex flex-wrap gap-1">
                        <span className="font-medium">Events:</span>
                        {webhook.webhookInterests.slice(0, 3).map((event) => (
                          <span key={event} className="text-gray-600">
                            {event}
                            {webhook.webhookInterests.indexOf(event) <
                              webhook.webhookInterests.length - 1 &&
                            webhook.webhookInterests
                              .slice(0, 3)
                              .indexOf(event) < 2
                              ? ","
                              : ""}
                          </span>
                        ))}
                        {webhook.webhookInterests.length > 3 && (
                          <span className="text-gray-500">
                            +{webhook.webhookInterests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => openEdit(webhook)}
                  className="pointer"
                  title="Edit webhook"
                >
                  <BlueEdit />
                </button>

                <button
                  onClick={() => handleDelete(webhook)}
                  className="pointer"
                  title="Delete webhook"
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
        <DialogContent className="sm:max-w-2xl p-6 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingWebhook ? "Edit Webhook" : "Create New Webhook"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Name</Label>
              <Input
                placeholder="Enter webhook name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* URL */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">URL</Label>
              <Input
                placeholder="https://example.com/webhook"
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
              />
            </div>

            {/* Private Webhook Toggle */}
            <div className="flex items-center gap-3">
              <Switch
                checked={form.authentication}
                onCheckedChange={(checked) =>
                  setForm({
                    ...form,
                    authentication: checked,
                    credentials: checked ? form.credentials : "",
                  })
                }
              />
              <Label className="text-sm font-medium cursor-pointer">
                Private Webhook
              </Label>
            </div>

            {/* Secret Token (only if Private) */}
            {form.authentication && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">Secret Token</Label>
                <Input
                  placeholder="Enter secret token"
                  type="password"
                  value={form.credentials}
                  onChange={(e) =>
                    setForm({ ...form, credentials: e.target.value })
                  }
                />
              </div>
            )}

            {/* Event Groups */}
            {loadingEvents ? (
              <div className="text-sm text-muted-foreground">
                Loading webhook events...
              </div>
            ) : (
              <div className="space-y-5 mt-6 pt-6 border-t">
                {eventGroups.map((group) => (
                  <div key={group.key} className="space-y-3">
                    <h3 className="text-sm font-semibold">{group.label}</h3>

                    {/* Selected events as chips */}
                    {form.webhookInterests.some((interest) =>
                      group.events.some((e) => e.eventSystemName === interest)
                    ) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {form.webhookInterests
                          .filter((interest) =>
                            group.events.some(
                              (e) => e.eventSystemName === interest
                            )
                          )
                          .map((eventSystemName) => (
                            <div
                              key={eventSystemName}
                              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              <span>{eventSystemName}</span>
                              <button
                                type="button"
                                onClick={() => removeEvent(eventSystemName)}
                                className="hover:text-blue-900 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Event checkboxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.events.map((event) => (
                        <label
                          key={event.eventSystemName}
                          className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={form.webhookInterests.includes(
                              event.eventSystemName
                            )}
                            onChange={() => toggleEvent(event.eventSystemName)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {event.eventReadableName}
                            </div>
                            <div className="text-xs text-gray-600">
                              {event.eventDescription}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
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
                disabled={isCreating || isUpdating}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {editingWebhook ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteConfirmDialog({ ...deleteConfirmDialog, isOpen })
        }
      >
        <DialogContent className="sm:max-w-md p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Delete Webhook
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the webhook{" "}
              <span className="font-semibold">
                "{deleteConfirmDialog.webhook?.name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() =>
                  setDeleteConfirmDialog({ isOpen: false, webhook: null })
                }
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
