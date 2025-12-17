import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetWebhooksListQuery,
  useDeleteWebhookMutation,
} from "@/redux/services/webhooks";

/* ---------------- Types (UI-side) ---------------- */
type EventGroup = {
  key: string;
  label: string;
  options: { key: string; label: string }[];
};

const EVENT_GROUPS: EventGroup[] = [
  {
    key: "order",
    label: "Order Events",
    options: [
      { key: "ORDER_CREATED", label: "Order Created" },
      { key: "ORDER_UPDATED", label: "Order Updated" },
    ],
  },
  {
    key: "payment",
    label: "Payment Events",
    options: [
      { key: "PAYMENT_CREATED", label: "Payment Created" },
      { key: "PAYMENT_UPDATED", label: "Payment Updated" },
    ],
  },
  { key: "prescription", label: "Prescription Events", options: [] },
  { key: "shipping", label: "Shipping Events", options: [] },
  { key: "pharmacy", label: "Pharmacy Events", options: [] },
  { key: "lab", label: "Lab Events", options: [] },
];

/* ---------------- Form State ---------------- */
const emptyForm = {
  name: "",
  url: "",
  isPrivate: false,
  secret: "",
  events: [] as string[],
};

export default function WebhookManagement({
    webhookRef,
    }: {
        webhookRef?: React.RefObject<HTMLDivElement | null>;
    }) {
  const { data, isLoading } = useGetWebhooksListQuery();
  const [deleteWebhook, { isLoading: deleting }] = useDeleteWebhookMutation();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- Helpers ---------------- */
  const resetForm = () => {
    setForm(emptyForm);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (w: any) => {
    setForm({
      name: w.name,
      url: w.url,
      isPrivate: w.authentication || false,
      secret: w.credentials || "",
      events: w.webhookInterests || [],
    });
    setOpen(true);
  };

  const toggleEvent = (key: string) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.includes(key)
        ? prev.events.filter((e) => e !== key)
        : [...prev.events, key],
    }));
  };

  // const onSubmit = async () => {
  //   if (mode === "create") {
  //     await createWebhook({
  //       name: form.name,
  //       url: form.url,
  //       isPrivate: form.isPrivate,
  //       secret: form.isPrivate ? form.secret : undefined,
  //       events: form.events,
  //     }).unwrap();
  //   } else if (currentId) {
  //     await updateWebhook({
  //       id: currentId,
  //       payload: {
  //         name: form.name,
  //         url: form.url,
  //         isPrivate: form.isPrivate,
  //         secret: form.isPrivate ? form.secret : undefined,
  //         events: form.events,
  //       },
  //     }).unwrap();
  //   }
  //   setOpen(false);
  //   resetForm();
  // };

  const onDelete = async (id: string) => {
    await deleteWebhook(id).unwrap();
  };

  /* ---------------- UI ---------------- */
  return (
    <Card ref={webhookRef} className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Webhook Management</CardTitle>
        <Button onClick={openCreate}>Add Webhook</Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && <div>Loading webhooks...</div>}

        {!isLoading && data?.result?.length === 0 && (
          <div className="text-sm text-muted-foreground">No webhooks found.</div>
        )}

        <div className="space-y-3">
          {data?.result?.map((w: any) => (
            <div
              key={w.id}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div className="space-y-1">
                <div className="font-medium">{w.name}</div>
                <div className="text-xs text-muted-foreground">{w.url}</div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(w)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleting}
                  onClick={() => onDelete(w.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* ---------------- Dialog ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Webhook URL</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <Switch
                checked={form.isPrivate}
                onCheckedChange={(v) =>
                  setForm({ ...form, isPrivate: v, secret: v ? form.secret : "" })
                }
              />
              <Label>Private Webhook</Label>
            </div>

            {form.isPrivate && (
              <div className="space-y-2 col-span-2">
                <Label>Secret Token</Label>
                <Input
                  value={form.secret}
                  onChange={(e) =>
                    setForm({ ...form, secret: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {EVENT_GROUPS.map((group) => (
              <div key={group.key} className="space-y-2">
                <div className="font-medium">{group.label}</div>

                {group.options.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No events available
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {group.options.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={form.events.includes(opt.key)}
                        onCheckedChange={() => toggleEvent(opt.key)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button>
              Create Webhook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
