import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/redux/services/authApi";
import type { RootState } from "@/redux/reducers";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/lib/utils";
export const AUTH_TOKEN = "auth_token";


const persistedToken = getLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

interface AuthState {
  token: string | null;

}

const initialState: AuthState = {
  token: persistedToken ? persistedToken : null,

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    },
  },
  extraReducers(builder) {

    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const token = payload?.token;
        if (token) {
          state.token = token;
          setLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
          setLocalStorage(LOCAL_STORAGE_KEYS.USER, payload.user);

        } else {
          state.token = null;
          setLocalStorage(LOCAL_STORAGE_KEYS.USER, payload.user);
        }
      }
    );
  },
});

export const selectIsLoggedIn = (state: RootState) => {
  return !!state.auth.token;
};
export const { logout } = authSlice.actions;
export default authSlice.reducer;
