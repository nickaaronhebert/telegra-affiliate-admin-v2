import type { CommunicationTemplateKeys } from "@/constants";
import { useGetCommunicationTemplatesQuery } from "@/redux/services/communicationTemplates";
import { useTypedSelector } from "@/redux/store";
import { selectAffiliateData } from "@/redux/slices/affiliate";

export const useCommunicationTemplate = (
  communicationTemplateKey: keyof CommunicationTemplateKeys
): boolean => {
  const { data: communicationTemplates = [] } =
    useGetCommunicationTemplatesQuery();

  const currentAffiliate = useTypedSelector(selectAffiliateData);

  const template = communicationTemplates.find(
    (template) => template.key === communicationTemplateKey
  );
  return !!(
    template && currentAffiliate?.communicationTemplates?.includes(template.id)
  );
};
