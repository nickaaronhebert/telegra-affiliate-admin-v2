import { useState, useEffect } from "react";
import type { SendBirdChannel } from "@/types/chat";

interface UseChannelsProps {
  sb: any; // SendBird SDK instance
  renderKey: number;
}

/**
 * Custom hook to fetch and manage SendBird channels
 * @param sb - SendBird SDK instance from useSendbirdStateContext
 * @param renderKey - Key to trigger re-fetch of channels
 * @returns Array of SendBird channels
 */
export const useChannels = ({
  sb,
  renderKey,
}: UseChannelsProps): SendBirdChannel[] => {
  const [channels, setChannels] = useState<SendBirdChannel[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!sb) return;

      try {
        const query = sb.groupChannel.createMyGroupChannelListQuery({
          includeEmpty: true,
          limit: 100,
        });

        const channelList = await query.next();
        setChannels(channelList || []);
      } catch (error) {
        console.error("[useChannels] Error fetching channels:", error);
        setChannels([]);
      }
    };

    fetchChannels();
  }, [sb, renderKey]);

  return channels;
};

