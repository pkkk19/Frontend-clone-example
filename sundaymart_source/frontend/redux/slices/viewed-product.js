import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewedProductList: [],
};

const viewedProductSlice = createSlice({
  name: "viewedProduct",
  initialState,
  reducers: {
    addToViewed(state, action) {
      const include = state.viewedProductList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (!(include >= 0)) {
        state.viewedProductList.push({ ...action.payload });
      }
    },
    clearViewedList(state, action) {
      state.viewedProductList = [];
    },
    updateViwed(state, action) {
      state.viewedProductList = action.payload;
    },
  },
});

export const { addToViewed, clearViewedList, updateViwed } =
  viewedProductSlice.actions;

export default viewedProductSlice.reducer;
