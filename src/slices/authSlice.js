import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInformation: localStorage.getItem("userInformation")
    ? JSON.parse(localStorage.getItem("userInformation"))
    : null,
  email: null,
  number: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInformation = action.payload;
      localStorage.setItem("userInformation", JSON.stringify(action.payload));
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    resetUserEmail: (state) => {
      state.email = null;
    },
    setUserPhone: (state, action) => {
      state.number = action.payload;
    },
    resetUserPhone: (state) => {
      state.number = null;
    },
    logout: (state) => {
      state.userInformation = null;
      localStorage.clear();
    },
  },
});

export const {
  setCredentials,
  logout,
  setUserEmail,
  resetUserEmail,
  setUserPhone,
  resetUserPhone,
} = authSlice.actions;

export default authSlice.reducer;
