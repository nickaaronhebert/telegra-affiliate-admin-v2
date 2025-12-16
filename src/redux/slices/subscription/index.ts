import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ORDER_ADDRESS as SUBSCRIPTION_ADDRESS,
  SELECT_ADDRESS,
} from "../create-order";

export interface PATIENT_DETAILS {
  email?: string;
  patient?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  medicationAllergies?: string[];
  currentMedications?: string[];
}

export interface PRODUCT_DETAILS {
  order: string;
  schedule: {
    interval: string;
    intervalCount: number;
    startDate: string;
    endDate?: string;
  };
  productVariations: {
    productVariation: string;
    quantity: number;
    pricePerUnitOverride: number;
    productName: string;
  }[];
}

export interface SubscriptionState {
  currentStep: number;
  patient: PATIENT_DETAILS;
  product: PRODUCT_DETAILS;
  sub_address: SELECT_ADDRESS;
  selectedAddress: SUBSCRIPTION_ADDRESS;
}

const initialState: SubscriptionState = {
  currentStep: 0,
  patient: {},
  product: {
    order: "",
    schedule: {
      interval: "",
      intervalCount: 0,
      startDate: "",
    },
    productVariations: [
      {
        productVariation: "",
        quantity: 0,
        pricePerUnitOverride: 0,
        productName: "",
      },
    ],
  },
  sub_address: {
    address: "",
  },
  selectedAddress: {
    shippingAddress: undefined,
    billingAddress: undefined,
    newBillingAddress: false,
    newShippingAddress: false,
  },
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    prevStep: (state) => {
      state.currentStep -= 1;
    },

    nextStep: (state) => {
      state.currentStep += 1;
    },

    updatePatientDetails: (state, action: PayloadAction<PATIENT_DETAILS>) => {
      state.patient = action.payload;
      //   state.currentStep += 1;
    },

    updateProductDetails: (state, action: PayloadAction<PRODUCT_DETAILS>) => {
      state.product = action.payload;
      state.currentStep += 1;
    },

    updateSubSelectedAddress: (
      state,
      action: PayloadAction<SELECT_ADDRESS>
    ) => {
      state.sub_address = action.payload;
    },

    updateSubscriptionAddress: (
      state,
      action: PayloadAction<SUBSCRIPTION_ADDRESS>
    ) => {
      state.selectedAddress = action.payload;
      state.currentStep += 1;
    },

    // updateInitialStep: (state, action: PayloadAction<PATIENT_DETAILS>) => {
    //   state.initialStep = action.payload;
    //   state.currentStep += 1;
    // },

    // updateStepOne: (state, action: PayloadAction<SELECT_PRODUCT>) => {
    //   state.stepOne = action.payload;
    //   state.currentStep += 1;
    // },
    // updateStepTwo: (state, action: PayloadAction<SELECT_ADDRESS>) => {
    //   state.stepTwo = action.payload;
    //   // state.currentStep += 1;
    // },
    // updateOrderAddress: (state, action: PayloadAction<ORDER_ADDRESS>) => {
    //   state.selectedAddress = action.payload;
    //   state.currentStep += 1;
    // },

    // updateOrderAmount: (state, action: PayloadAction<ORDER_AMOUNT>) => {
    //   state.orderAmount = action.payload;
    // },

    // presetOrder: (_state, action: PayloadAction<OrderState>) => {
    //   return {
    //     ...action.payload,
    //   };
    // },

    resetSubscription: () => initialState,
  },
});

export const {
  prevStep,
  updatePatientDetails,
  updateProductDetails,
  updateSubSelectedAddress,
  updateSubscriptionAddress,
  nextStep,
  resetSubscription,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
