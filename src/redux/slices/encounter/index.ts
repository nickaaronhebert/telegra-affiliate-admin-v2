import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EncounterState {
  selectedEncounterId: string | null;
  filters: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

const initialState: EncounterState = {
  selectedEncounterId: null,
  filters: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  },
};

const encounterSlice = createSlice({
  name: "encounter",
  initialState,
  reducers: {
    setSelectedEncounterId: (state, action: PayloadAction<string | null>) => {
      state.selectedEncounterId = action.payload;
    },
    setEncounterFilters: (state, action: PayloadAction<Partial<EncounterState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearEncounterFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSelectedEncounterId,
  setEncounterFilters,
  clearEncounterFilters,
} = encounterSlice.actions;

export default encounterSlice.reducer;
