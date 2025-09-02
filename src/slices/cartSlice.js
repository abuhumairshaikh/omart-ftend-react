import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartutils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "COD" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const index = state.cartItems.findIndex(
        (cart) => cart?.product_id === item?.product_id
      );
      if (index !== -1) {
        state.cartItems[index] = {
          ...state?.cartItems[index],
          quantity: item.quantity, // Update quantity properly
          price: item.price, // Ensure price is updated
        };
      } else {
        state?.cartItems?.push(item);
      }

      return updateCart(state); // Call updateCart to recalculate prices
    },
    removeFromCart: (state, action) => {
      state.cartItems = state?.cartItems?.filter(
        (data) => data?.product_id !== action.payload
      );
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
    resetCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
      state = initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
