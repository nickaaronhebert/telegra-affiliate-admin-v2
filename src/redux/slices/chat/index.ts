import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/reducers";
import type { IConversationData } from "@/types/chat";

interface ChatState {
  conversationData: IConversationData | null;
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: ChatState = {
  conversationData: null,
  loading: false,
  error: null,
  unreadCount: 0,
};

// Async thunk for getting unread count
export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async ({ affiliateId }: { affiliateId?: string }, { rejectWithValue }) => {
    try {
      // TODO: Implement API call to get unread count
      // const response = await chatApi.getUnreadCount(affiliateId);
      // return response.data;
      console.log('Getting unread count for affiliate:', affiliateId);
      return 0;
    } catch (error) {
      return rejectWithValue('Failed to fetch unread count');
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversationData: (state, action: PayloadAction<IConversationData | null>) => {
      state.conversationData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    clearChat: (state) => {
      state.conversationData = null;
      state.loading = false;
      state.error = null;
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUnreadCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectConversationData = (state: RootState) => state.chat?.conversationData;
export const selectConversationsLoading = (state: RootState) => state.chat?.loading;
export const selectUnreadCount = (state: RootState) => state.chat?.unreadCount;

export const {
  setConversationData,
  setLoading,
  setError,
  setUnreadCount,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
