import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  savedAddressList: [],
};

const savedAddressSlice = createSlice({
  name: "savedAddress",
  initialState,
  reducers: {
    addToSaved(store, action) {
      const existingIndex = store.savedAddressList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        store.savedAddressList[existingIndex] = { ...action.payload };
      } else {
        store.savedAddressList.push({ ...action.payload });
      }
    },
    removeFromSaved(store, action) {
      store.savedAddressList.map((address) => {
        if (address.id === action.payload.id) {
          const nextAddressItems = store.savedAddressList.filter(
            (item) => item.id !== address.id
          );
          store.savedAddressList = nextAddressItems;
        }
        return store;
      });
    },
    clearAddress(state) {
      state.savedAddressList = [];
    },
  },
});

export const { addToSaved, removeFromSaved, clearAddress } =
  savedAddressSlice.actions;

export default savedAddressSlice.reducer;
