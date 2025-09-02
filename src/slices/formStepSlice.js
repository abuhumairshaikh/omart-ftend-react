import { createSlice } from "@reduxjs/toolkit";

const getValidStepFromLocalStorage = () => {
  const storedStep = localStorage.getItem("step");
  try {
    return storedStep ? JSON.parse(storedStep) : 1;
  } catch (e) {
    return 1;
  }
};
const stepSlice = createSlice({
  name: "step",
  initialState: getValidStepFromLocalStorage,
  reducers: {
    incrementFormStep: (state) => {
      state.step += 1;
      localStorage.setItem("step", JSON.stringify(state.step));
    },
    decrementFormStep: (state) => {
      state.step -= 1;
      localStorage.setItem("step", JSON.stringify(state.step));
    },
  },
});

export const { incrementFormStep, decrementFormStep } = stepSlice.actions;

export default stepSlice.reducer;
