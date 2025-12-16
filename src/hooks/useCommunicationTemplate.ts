import type { CommunicationTemplateKeys } from '@/constants';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { useGetCommunicationTemplatesQuery } from '@/redux/services/communicationTemplates';
import { getLocalStorage } from '@/lib/utils';

export const useCommunicationTemplate = (
  communicationTemplateKey: keyof CommunicationTemplateKeys
): boolean => {
  const { data: communicationTemplates = [] } = useGetCommunicationTemplatesQuery();
  const currentAffiliate = getLocalStorage(LOCAL_STORAGE_KEYS.USER);

  const template = communicationTemplates.find(
    (template) => template.key === communicationTemplateKey
  );

  return !!(
    template &&
    currentAffiliate?.communicationTemplates?.includes(template.id)
  );
};
