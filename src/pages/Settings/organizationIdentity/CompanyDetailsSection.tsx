import React, { useState } from "react";
import {
    useGetAffiliateDetailsQuery,
    useUpdateAffiliateDetailsMutation,
} from "@/redux/services/organizationIdentity";
import type { IUpdateAffiliateDetailsRequest } from "@/types/requests/organizationIdentity";
import CompanyDetailsEditDialog from "./CompanyDetailsEditDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus } from "lucide-react";

interface CompanyDetailsSectionProps {
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function CompanyDetailsSection({
    sectionRef,
}: CompanyDetailsSectionProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { data: affiliateDetails, isLoading, error } = useGetAffiliateDetailsQuery();
    const [updateAffiliate] = useUpdateAffiliateDetailsMutation();

    const handleEditSave = async (formData: IUpdateAffiliateDetailsRequest) => {
        try {
            await updateAffiliate(formData).unwrap();
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error("Failed to update affiliate details:", err);
        }
    };

    if (isLoading) {
        return (
            <div ref={sectionRef} className="space-y-6">
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-500">Loading company details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div ref={sectionRef} className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700">
                        Failed to load company details. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div ref={sectionRef} className="space-y-6">

                <Card
                    className="border-0 outline-none"
                    style={{ boxShadow: "0px 2px 40px 0px #00000014" }}
                >
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Company Information</CardTitle>

                        <Button
                            className="flex bg-black text-white text-[10px] font-semibold w-[70px] h-[28px] rounded-[4px] pointer hover:bg-gray-800"
                            onClick={() => setIsEditDialogOpen(true)}
                            variant="default"
                            size="sm"
                        >
                        <Plus />
                            EDIT
                        </Button>
                    </CardHeader>
                    <CardContent className="">
                        <div className="space-y-2 bg-light-background border border-light-border p-6 rounded-md">
                            {/* Company Name */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    Company Name
                                </label>
                                <p className="ml-auto text-sm font-medium">
                                    {affiliateDetails?.name || "-"}
                                </p>
                            </div>

                            {/* Home Page URL */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    Home Page URL
                                </label>
                                <p className="ml-auto text-sm font-medium">
                                    {affiliateDetails?.url || "-"}
                                </p>
                            </div>

                            {/* Correspondence Manager */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    Correspondence Manager
                                </label>
                                <div className="ml-auto text-sm font-medium">
                                    {affiliateDetails?.correspondenceManager?.replace(/-/g, " ") || "-"}
                                </div>
                            </div>

                            {/* Co-Branded */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    Co-Branded
                                </label>
                                <span
                                    className={`ml-auto inline-flex items-center px-1 py-1 rounded text-[10px] font-medium ${affiliateDetails?.coBranding
                                        ? "bg-green-100 text-[#1AA061] border border-[#1AA061]"
                                        : "bg-red-100 text-red-800 border border-red-100"
                                        }`}
                                >
                                    {affiliateDetails?.coBranding ? "ENABLE" : "DISABLE"}
                                </span>
                            </div>

                            {/* White-Labeled */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    White-Labeled
                                </label>
                                <span
                                    className={`ml-auto inline-flex items-center px-1 py-1 rounded text-[10px] font-medium ${affiliateDetails?.whiteLabeling
                                        ? "bg-green-100 text-[#1AA061] border border-[#1AA061]"
                                        : "bg-red-100 text-red-800 border border-red-100"
                                        }`}
                                >
                                    {affiliateDetails?.whiteLabeling ? "ENABLE" : "DISABLE"}
                                </span>
                            </div>

                            {/* Terms of Service */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    Terms of Service
                                </label>
                                <a
                                    href={affiliateDetails?.legalLinks?.termsOfService}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto text-sm font-medium text-[#3E4D61]"
                                >
                                    {affiliateDetails?.legalLinks?.termsOfService || "N/A"}
                                </a>
                            </div>

                            {/* Privacy Policy */}
                            <div className="flex items-center">
                                <label className="w-56 text-sm font-normal text-[#63627F]">
                                    Privacy Policy
                                </label>
                                <a
                                    href={affiliateDetails?.legalLinks?.privacyPolicy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto text-sm font-medium text-[#3E4D61]"
                                >
                                    {affiliateDetails?.legalLinks?.privacyPolicy || "N/A"}
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <CompanyDetailsEditDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleEditSave}
                initialData={affiliateDetails}
            />
        </>
    );
}
