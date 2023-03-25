import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  currentStore: {},
};

const saveUser = createSlice({
  name: "stores",
  initialState,
  reducers: {
    addCurrentStore(store, action) {
      store.currentStore = action.payload;
    },
    removeCurrentStore(store, action) {
      store.currentStore = {};
    },
  },
});

export const { addCurrentStore, removeCurrentStore } = saveUser.actions;

export default saveUser.reducer;
