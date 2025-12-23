import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/reducers";
import type { AffiliateMe } from "../../services/affiliate";

interface AffiliateState {
  data: AffiliateMe | null;
  loading: boolean;
  error: string | null;
}

const initialState: AffiliateState = {
  data: null,
  loading: false,
  error: null,
};

const affiliateSlice = createSlice({
  name: "affiliate",
  initialState,
  reducers: {
    setAffiliateData: (state, action: PayloadAction<AffiliateMe>) => {
      state.data = action.payload;
      state.error = null;
    },
    setAffiliateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAffiliateError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAffiliate: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Selectors
export const selectAffiliateData = (state: RootState) => state.affiliate.data;
export const selectAffiliateLoading = (state: RootState) => state.affiliate.loading;
export const selectAffiliateError = (state: RootState) => state.affiliate.error;

export const {
  setAffiliateData,
  setAffiliateLoading,
  setAffiliateError,
  clearAffiliate,
} = affiliateSlice.actions;

export default affiliateSlice.reducer;
