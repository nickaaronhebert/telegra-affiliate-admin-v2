import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseApi } from "./services";
import "./services/register-services"; // Ensure all services are registered
import orderReducer from "@/redux/slices/create-order";
import subscriptionReducer from "@/redux/slices/subscription";
import authReducer from "@/redux/slices/auth";
import productVariationsReducer from "@/redux/slices/product-variations";
import patientReducer from "@/redux/slices/patient";
import communicationTemplatesReducer from "@/redux/slices/communicationTemplates";
import affiliateReducer from "@/redux/slices/affiliate";

import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { LOCAL_STORAGE_KEYS } from "@/constants";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    order: orderReducer,
    subscription: subscriptionReducer,
    auth: authReducer,
    productVariations: productVariationsReducer,
    patient: patientReducer,
    communicationTemplates: communicationTemplatesReducer,
    affiliate: affiliateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});