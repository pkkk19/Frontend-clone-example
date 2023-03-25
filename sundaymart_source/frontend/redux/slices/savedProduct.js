import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedProductList: [],
};

const savedProductSlice = createSlice({
  name: "savedProduct",
  initialState,
  reducers: {
    addToSaved(store, action) {
      store.savedProductList.push({ ...action.payload });
    },
    removeFromSaved(state, action) {
      state.savedProductList.map((productItem) => {
        if (productItem.id === action.payload.id) {
          const nextProductItems = state.savedProductList.filter(
            (item) => item.id !== productItem.id
          );
          state.savedProductList = nextProductItems;
        }
        return state;
      });
    },
    clearList(state, action) {
      state.savedProductList = [];
    },
    updateSaved(state, action) {
      state.savedProductList = action.payload;
    },
  },
});

export const { addToSaved, removeFromSaved, clearList, updateSaved } =
  savedProductSlice.actions;

export default savedProductSlice.reducer;
