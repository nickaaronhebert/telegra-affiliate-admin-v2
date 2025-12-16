import { createSlice } from '@reduxjs/toolkit';
import type { ICommunicationTemplate } from '@/types/communicationTemplates';

interface CommunicationTemplatesState {
  communicationTemplates: ICommunicationTemplate[];
  isLoading: boolean;
}

const initialState: CommunicationTemplatesState = {
  communicationTemplates: [],
  isLoading: false,
};

// Slice
const communicationTemplatesSlice = createSlice({
  name: 'communicationTemplates',
  initialState,
  reducers: {
    getCommunicationTemplates: (state) => {
      if (!state.isLoading) {
        state.isLoading = true;
      }
    },
    setCommunicationTemplates: (state, { payload }) => {
      state.isLoading = false;
      state.communicationTemplates = payload;
    },
    failAction: (state) => {
      state.isLoading = false;
    }
  }
});

export const {
  getCommunicationTemplates,
  setCommunicationTemplates,
  failAction
} = communicationTemplatesSlice.actions;

export default communicationTemplatesSlice.reducer;

// Selectors
export const getCommunicationTemplatesSelector = (state: any) =>
  state && state.communicationTemplates.communicationTemplates;

export const getCommunicationTemplatesLoadingSelector = (state: any) =>
  state && state.communicationTemplates.isLoading;