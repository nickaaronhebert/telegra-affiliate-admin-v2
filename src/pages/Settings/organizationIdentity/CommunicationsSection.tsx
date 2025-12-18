import React, { useState, useEffect } from "react";
import {
    useGetAffiliateDetailsQuery,
    useUpdateAffiliateDetailsMutation,
    useGetCommunicationTemplatesAffiliateQuery,
} from "@/redux/services/organizationIdentity";
import type { ICommunicationTemplate } from "@/types/responses/communicationTemplates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Communication from "@/assets/icons/Communication";

interface CommunicationsSectionProps {
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function CommunicationsSection({
    sectionRef,
}: CommunicationsSectionProps) {
    const { data: affiliateDetails, isLoading: isLoadingAffiliate } =
        useGetAffiliateDetailsQuery();
    const { data: templates = [], isLoading: isLoadingTemplates } =
        useGetCommunicationTemplatesAffiliateQuery();
    const [updateAffiliate] = useUpdateAffiliateDetailsMutation();

    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    // Initialize selected templates from affiliate details
    useEffect(() => {
        if (affiliateDetails?.communicationTemplates) {
            setSelectedTemplates(affiliateDetails.communicationTemplates);
        }
    }, [affiliateDetails]);

    const handleToggleTemplate = async (
        templateId: string,
        template: ICommunicationTemplate
    ) => {
        // Don't allow toggling required templates
        if (template.required) {
            return;
        }

        setIsUpdating(true);
        try {
            const newSelectedTemplates = selectedTemplates.includes(templateId)
                ? selectedTemplates.filter((id) => id !== templateId)
                : [...selectedTemplates, templateId];

            setSelectedTemplates(newSelectedTemplates);

            await updateAffiliate({
                name: affiliateDetails?.name || "",
                url: affiliateDetails?.url || "",
                correspondenceManager: affiliateDetails?.correspondenceManager || "",
                whiteLabeling: affiliateDetails?.whiteLabeling,
                coBranding: affiliateDetails?.coBranding,
                legalLinks: affiliateDetails?.legalLinks || {
                    privacyPolicy: "",
                    termsOfService: "",
                },
                communicationTemplates: newSelectedTemplates,
            }).unwrap();
        } catch (err) {
            console.error("Failed to update communication templates:", err);
            // Revert the change
            setSelectedTemplates(affiliateDetails?.communicationTemplates || []);
        } finally {
            setIsUpdating(false);
        }
    };

    const isLoading = isLoadingAffiliate || isLoadingTemplates;

    if (isLoading) {
        return (
            <div ref={sectionRef} className="space-y-6">
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-500">Loading communications...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={sectionRef} className="space-y-6">

            <Card className="border-0 outline-none" style={{ boxShadow: "0px 2px 40px 0px #00000014" }}>
                <CardHeader>
                    <CardTitle>Activate Communication Emails</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {templates.length === 0 ? (
                            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                                <p className="text-sm text-yellow-700">
                                    No communication templates available.
                                </p>
                            </div>
                        ) : (
                            templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start  gap-2">

                                            <div className="shrink-0 mt-1">
                                                <Communication />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {template.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-4 shrink-0">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                {template.required && <Badge variant="required">REQUIRED</Badge>}
                                            </div>
                                        </div>

                                        <Switch
                                            checked={selectedTemplates.includes(template.id)}
                                            onCheckedChange={() =>
                                                handleToggleTemplate(template.id, template)
                                            }
                                            disabled={template.required || isUpdating}
                                            className={
                                                template.required ? "opacity-50 cursor-not-allowed" : "pointer"
                                            }
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
