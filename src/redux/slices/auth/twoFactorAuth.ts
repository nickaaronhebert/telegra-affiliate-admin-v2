import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/global/commonTypes";
import type { RootState } from "@/redux/reducers";

interface TwoFactorAuthState {
  accessToken: string | null;
  userData: User | null;
}

const initialState: TwoFactorAuthState = {
  accessToken: null,
  userData: null,
};

const twoFactorAuthSlice = createSlice({
  name: "twoFactorAuth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    clearTwoFactorState: (state) => {
      state.accessToken = null;
      state.userData = null;
    },
  },
});

export const selectTwoFactorAccessToken = (state: RootState) =>
  state.twoFactorAuth?.accessToken || null;

export const selectTwoFactorUserData = (state: RootState) =>
  state.twoFactorAuth?.userData || null;

export const { setAccessToken, setUserData, clearTwoFactorState } =
  twoFactorAuthSlice.actions;

export default twoFactorAuthSlice;
