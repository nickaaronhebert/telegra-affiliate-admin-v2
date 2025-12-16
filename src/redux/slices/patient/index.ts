import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PatientState {
  selectedPatientId: string | null;
  filters: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

const initialState: PatientState = {
  selectedPatientId: null,
  filters: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  },
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setSelectedPatientId: (state, action: PayloadAction<string | null>) => {
      state.selectedPatientId = action.payload;
    },
    setPatientFilters: (state, action: PayloadAction<Partial<PatientState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearPatientFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSelectedPatientId,
  setPatientFilters,
  clearPatientFilters,
} = patientSlice.actions;

export default patientSlice.reducer;