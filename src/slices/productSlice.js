import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductCategory: (state, action) => {
      state.product = action.payload;
    },
    resetCategory: (state) => {
      state.product = "";
    },
  },
});

export const { setProductCategory, resetCategory } = productSlice.actions;

export default productSlice.reducer;
