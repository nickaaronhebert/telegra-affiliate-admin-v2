import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface BrandIdentityProps {
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

interface BrandFormData {
    brandName: string;
    brandTagline: string;
    brandLogo: File | null;
    logoPreview: string | null;
    primaryColor: string;
    accentColor: string;
    neutralColor: string;
}

export default function BrandIdentity({
    sectionRef,
}: BrandIdentityProps) {
    const [formData, setFormData] = useState<BrandFormData>({
        brandName: "Your Brand",
        brandTagline: "Your brand tagline here",
        brandLogo: null,
        logoPreview: null,
        primaryColor: "#5456ad",
        accentColor: "#d8b8f3",
        neutralColor: "#fcf9ff",
    });

    const [isUpdating, setIsUpdating] = useState(false);

    const handleInputChange = (field: keyof BrandFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validTypes.includes(file.type)) {
                alert("Please upload a JPG, JPEG, PNG, or GIF file");
                return;
            }

            // Validate file size (200kb)
            if (file.size > 200 * 1024) {
                alert("File size must be less than 200kb");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    brandLogo: file,
                    logoPreview: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImportFromAccount = () => {
        // TODO: Implement API call to import brand settings from main account
        alert("Import functionality will be implemented with API integration");
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            // TODO: Implement API call to save brand identity
            console.log("Saving brand identity:", formData);
            alert("Brand identity saved successfully!");
        } catch (err) {
            console.error("Failed to save brand identity:", err);
            alert("Failed to save brand identity. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        // Reset to initial state
        setFormData({
            brandName: "Your Brand",
            brandTagline: "Your brand tagline here",
            brandLogo: null,
            logoPreview: null,
            primaryColor: "#5456ad",
            accentColor: "#d8b8f3",
            neutralColor: "#fcf9ff",
        });
    };

    return (
        <div ref={sectionRef} className="space-y-6">
            <Card
                className="border-0 outline-none"
                style={{ boxShadow: "0px 2px 40px 0px #00000014" }}
            >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Brand Identity</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-[15px] font-semibold">Import brand settings <br></br>from your main account</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleImportFromAccount}
                            className="text-xs bg-black text-white hover:bg-gray-800 hover:text-white pointer font-semibold px-10 py-5 border-0 rounded"
                        >
                            APPLY FROM MY ACCOUNT SETTINGS
                        </Button>
                    </div>
                    {/* Brand Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={formData.brandName}
                            onChange={(e) =>
                                handleInputChange("brandName", e.target.value)
                            }
                            placeholder="Your Brand"
                            className="h-10"
                        />
                    </div>

                    {/* Brand Tagline */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">
                            Brand Tagline <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={formData.brandTagline}
                            onChange={(e) =>
                                handleInputChange("brandTagline", e.target.value)
                            }
                            placeholder="Your brand tagline here"
                            className="h-10"
                        />
                    </div>

                    {/* Brand Logo */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">
                            Brand Logo <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <div className="flex flex-col items-center gap-4">
                                {formData.logoPreview ? (
                                    <div className="w-full flex flex-col items-center gap-4">
                                        <img
                                            src={formData.logoPreview}
                                            alt="Brand Logo Preview"
                                            className="h-24 object-contain"
                                            style={{
                                                backgroundColor: "#ffffff",
                                                padding: "8px",
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                document
                                                    .getElementById("logo-upload")
                                                    ?.click()
                                            }
                                        >
                                            Change Logo
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                document
                                                    .getElementById("logo-upload")
                                                    ?.click()
                                            }
                                        >
                                            Upload
                                        </Button>
                                    </div>
                                )}
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <div className="text-xs text-gray-500 space-y-1 text-center">
                                    <p>
                                        <strong>Recommended dimensions:</strong>{" "}
                                        400x100px
                                    </p>
                                    <p>
                                        <strong>Required File Type:</strong> JPG,
                                        JPEG, PNG & GIF
                                    </p>
                                    <p>
                                        <strong>File weight:</strong> 200kb
                                    </p>
                                    <p className="mt-2">
                                        The logo will be displayed over white
                                        backgrounds
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand Colors */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold">
                            Brand Colors <span className="text-red-500">*</span>
                        </label>

                        <div className="">
                            {/* Primary Color */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">
                                    Primary
                                </label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                                        style={{
                                            backgroundColor:
                                                formData.primaryColor,
                                        }}
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "primary-color-input"
                                                )
                                                ?.click()
                                        }
                                    />
                                    <Input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "primaryColor",
                                                e.target.value
                                            )
                                        }
                                        className="h-10 text-sm bg-[#EFE9F4]"
                                    />
                                    <input
                                        id="primary-color-input"
                                        type="color"
                                        value={formData.primaryColor}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "primaryColor",
                                                e.target.value
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">
                                    Accent
                                </label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                                        style={{
                                            backgroundColor:
                                                formData.accentColor,
                                        }}
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "accent-color-input"
                                                )
                                                ?.click()
                                        }
                                    />
                                    <Input
                                        type="text"
                                        value={formData.accentColor}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "accentColor",
                                                e.target.value
                                            )
                                        }
                                        className="h-10 text-sm bg-[#EFE9F4]"
                                    />
                                    <input
                                        id="accent-color-input"
                                        type="color"
                                        value={formData.accentColor}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "accentColor",
                                                e.target.value
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Neutral Color */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">
                                    Neutral
                                </label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                                        style={{
                                            backgroundColor:
                                                formData.neutralColor,
                                        }}
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "neutral-color-input"
                                                )
                                                ?.click()
                                        }
                                    />
                                    <Input
                                        type="text"
                                        value={formData.neutralColor}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "neutralColor",
                                                e.target.value
                                            )
                                        }
                                        className="h-10 text-sm bg-[#EFE9F4]"
                                    />
                                    <input
                                        id="neutral-color-input"
                                        type="color"
                                        value={formData.neutralColor}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "neutralColor",
                                                e.target.value
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            {isUpdating ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
