import React, { useState, useEffect } from "react";
import type {
    IGetAffiliateDetailsResponse,
} from "@/types/responses/organizationIdentity";
import type { IUpdateAffiliateDetailsRequest } from "@/types/requests/organizationIdentity";
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CompanyDetailsEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: IUpdateAffiliateDetailsRequest) => Promise<void>;
    initialData?: IGetAffiliateDetailsResponse;
}

const CORRESPONDENCE_MANAGERS = [
    { value: "telemdnow-system", label: "TelegraMD System" },
    { value: "patient-portal", label: "Your Patient Portal" },
    { value: "email", label: "Email" },
];

export default function CompanyDetailsEditDialog({
    isOpen,
    onClose,
    onSave,
    initialData,
}: CompanyDetailsEditDialogProps) {
    const [formData, setFormData] = useState<IUpdateAffiliateDetailsRequest>({
        name: "",
        url: "",
        correspondenceManager: "telemdnow-system",
        whiteLabeling: false,
        coBranding: true,
        legalLinks: {
            privacyPolicy: "",
            termsOfService: "",
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                url: initialData.url || "",
                correspondenceManager: initialData.correspondenceManager || "telemdnow-system",
                whiteLabeling: initialData.whiteLabeling || false,
                coBranding: initialData.coBranding ?? true,
                legalLinks: {
                    privacyPolicy: initialData.legalLinks?.privacyPolicy || "",
                    termsOfService: initialData.legalLinks?.termsOfService || "",
                },
            });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLegalLinkChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "privacyPolicy" | "termsOfService"
    ) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            legalLinks: {
                ...prev.legalLinks,
                [field]: value,
            },
        }));
    };

    const handleToggle = (field: "whiteLabeling" | "coBranding", value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCorrespondenceManagerChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            correspondenceManager: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Validate required fields
            if (!formData.name.trim()) {
                setError("Company Name is required");
                setIsLoading(false);
                return;
            }
            if (!formData.url.trim()) {
                setError("Home Page URL is required");
                setIsLoading(false);
                return;
            }

            await onSave(formData);
            toast.success("Company details updated successfully", {
                duration: 1500,
            });
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to save changes. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[490px]">
                <DialogHeader className="border-b border-gray-200 p-4">
                    <DialogTitle>Edit Company Details</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 p-4 pt-0">
                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    <div className="flex justify-between gap-4">
                        {/* Company Name */}
                        <div className="space-y-2 w-full">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="name" className="font-semibold">Company Name</Label>
                                <span className="text-[var(--destructive)]">*</span>
                            </div>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter company name"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Home Page URL */}
                        <div className="space-y-2 w-full">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="url" className="font-semibold">Home Page URL</Label>
                                <span className="text-[var(--destructive)]">*</span>
                            </div>
                            <Input
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                                disabled={isLoading}
                                type="url"
                            />
                        </div>
                    </div>
                    {/* Correspondence Manager */}
                    <div className="space-y-2 w-full">
                        <div className="flex items-center gap-1">
                            <Label className="font-semibold">Correspondence Manager</Label>
                            <span className="text-[var(--destructive)]">*</span>
                        </div>
                        <Select
                            value={formData.correspondenceManager}
                            onValueChange={handleCorrespondenceManagerChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger id="correspondenceManager" className="w-full">
                                <SelectValue placeholder="Select correspondence manager" />
                            </SelectTrigger>
                            <SelectContent>
                                {CORRESPONDENCE_MANAGERS.map((manager) => (
                                    <SelectItem key={manager.value} value={manager.value}>
                                        {manager.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Toggle Switches */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border border-light-border p-3 rounded-md">
                            <div>
                                <Label className="text-sm font-semibold">Co-Branded</Label>
                            </div>
                            <Switch
                                checked={formData.coBranding}
                                onCheckedChange={(value) => handleToggle("coBranding", value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between border border-light-border p-3 rounded-md">
                            <div>
                                <Label className="text-sm font-semibold">White-Labeled</Label>
                            </div>
                            <Switch
                                checked={formData.whiteLabeling}
                                onCheckedChange={(value) => handleToggle("whiteLabeling", value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="termsOfService" className="font-semibold">Terms of Service Link</Label>
                            <Input
                                id="termsOfService"
                                value={formData.legalLinks.termsOfService}
                                onChange={(e) => handleLegalLinkChange(e, "termsOfService")}
                                placeholder="https://example.com/terms"
                                disabled={isLoading}
                                type="url"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="privacyPolicy" className="font-semibold">Privacy Policy Link</Label>
                            <Input
                                id="privacyPolicy"
                                value={formData.legalLinks.privacyPolicy}
                                onChange={(e) => handleLegalLinkChange(e, "privacyPolicy")}
                                placeholder="https://example.com/privacy"
                                disabled={isLoading}
                                type="url"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-[16px]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
