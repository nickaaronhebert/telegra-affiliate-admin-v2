import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SELECT_PRODUCT {
  productVariations: {
    productVariation: string;
    quantity: number;
    pricePerUnitOverride: number;
    productName: string;
  }[];
}

export interface PATIENT_DETAILS {
  patient?: string;
}

export interface SELECT_ADDRESS {
  address?: string;
}

export interface SELECT_DISPENSING {
  transmissionMethod: "manual" | "auto";
}

export interface ADDRESS {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface ORDER_ADDRESS {
  shippingAddress?: ADDRESS;
  billingAddress?: ADDRESS;
  newBillingAddress: boolean;
  newShippingAddress: boolean;
}

export interface ORDER_AMOUNT {
  subtotal: string;
  totalAmount: string;
  coupon?: string;
  couponDiscount?: string;
}

export interface OrderState {
  currentStep: number;
  initialStep: PATIENT_DETAILS;
  stepOne: SELECT_PRODUCT;
  selectedAddress: ORDER_ADDRESS;
  stepTwo: SELECT_ADDRESS;
  orderAmount: ORDER_AMOUNT;
}

const initialState: OrderState = {
  currentStep: 0,
  initialStep: {
    patient: "",
  },
  stepOne: {
    productVariations: [
      {
        productVariation: "",
        quantity: 1,
        pricePerUnitOverride: 0,
        productName: "",
      },
    ],
  },
  stepTwo: {
    address: "",
  },
  selectedAddress: {
    shippingAddress: undefined,
    billingAddress: undefined,
    newBillingAddress: false,
    newShippingAddress: false,
  },
  orderAmount: {
    totalAmount: "",
    subtotal: "",
  },
};

const orderSlice = createSlice({
  name: "create-order",
  initialState,
  reducers: {
    prevStep: (state) => {
      state.currentStep -= 1;
    },

    updateInitialStep: (state, action: PayloadAction<PATIENT_DETAILS>) => {
      state.initialStep = action.payload;
      state.currentStep += 1;
    },

    updateStepOne: (state, action: PayloadAction<SELECT_PRODUCT>) => {
      state.stepOne = action.payload;
      state.currentStep += 1;
    },
    updateStepTwo: (state, action: PayloadAction<SELECT_ADDRESS>) => {
      state.stepTwo = action.payload;
      // state.currentStep += 1;
    },
    updateOrderAddress: (state, action: PayloadAction<ORDER_ADDRESS>) => {
      state.selectedAddress = action.payload;
      state.currentStep += 1;
    },

    updateOrderAmount: (state, action: PayloadAction<ORDER_AMOUNT>) => {
      state.orderAmount = action.payload;
    },

    presetOrder: (_state, action: PayloadAction<OrderState>) => {
      return {
        ...action.payload,
      };
    },

    resetOrder: () => initialState,
  },
});

export const {
  prevStep,
  updateOrderAddress,
  updateStepTwo,
  updateInitialStep,
  updateStepOne,
  resetOrder,
  presetOrder,
  updateOrderAmount,
} = orderSlice.actions;
export default orderSlice.reducer;
