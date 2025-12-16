import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductVariationMapping } from "@/types/responses/productVariations";

interface ProductVariationsState {
  selectedProductVariation: ProductVariationMapping | null;
  searchResults: ProductVariationMapping[];
  isLoading: boolean;
  searchQuery: string;
}

const initialState: ProductVariationsState = {
  selectedProductVariation: null,
  searchResults: [],
  isLoading: false,
  searchQuery: "",
};

const productVariationsSlice = createSlice({
  name: "productVariations",
  initialState,
  reducers: {
    setSelectedProductVariation: (
      state,
      action: PayloadAction<ProductVariationMapping | null>
    ) => {
      state.selectedProductVariation = action.payload;
    },
    setSearchResults: (
      state,
      action: PayloadAction<ProductVariationMapping[]>
    ) => {
      state.searchResults = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = "";
      state.selectedProductVariation = null;
    },
  },
});

export const {
  setSelectedProductVariation,
  setSearchResults,
  setIsLoading,
  setSearchQuery,
  clearSearch,
} = productVariationsSlice.actions;

export default productVariationsSlice.reducer;