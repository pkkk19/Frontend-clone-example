import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const saveUser = createSlice({
  name: "user",
  initialState,
  reducers: {
    savedUser(store, action) {
      store.data = action.payload;
    },
    clearUser(store, action) {
      store.data = {};
    },
  },
});

export const { savedUser, clearUser } = saveUser.actions;

export default saveUser.reducer;
