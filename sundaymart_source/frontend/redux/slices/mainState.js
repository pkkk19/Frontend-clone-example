import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  openModal: false,
  mapContent: "",
  visibleAuth: false,
  drawerContent: null,
  authContent: null,
  editAddress: null,
  opengomodal: false,
  isOpenConfirm: false,
  isOpenConfirmCheckout: false,
  sort: "asc",
};

const chatSlice = createSlice({
  name: "mainState",
  initialState,
  reducers: {
    setVisible(state, action) {
      state.visible = action.payload;
    },
    setOpenModal(state, action) {
      state.openModal = action.payload;
    },
    setMapContent(state, action) {
      state.mapContent = action.payload;
    },
    setVisibleAuth(state, action) {
      state.visibleAuth = action.payload;
    },
    setDrawerContent(state, action) {
      state.drawerContent = action.payload;
    },
    setAuthContent(state, action) {
      state.authContent = action.payload;
    },
    setEditAddress(state, action) {
      state.editAddress = action.payload;
    },
    setOpengomodal(state, action) {
      state.opengomodal = action.payload;
    },
    setIsOpenConfirm(state, action) {
      state.isOpenConfirm = action.payload;
    },
    setIsOpenConfirmCheckout(state, action) {
      state.isOpenConfirmCheckout = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
  },
});

export const {
  setVisible,
  setOpenModal,
  setMapContent,
  setVisibleAuth,
  setDrawerContent,
  setAuthContent,
  setEditAddress,
  setOpengomodal,
  setIsOpenConfirm,
  setIsOpenConfirmCheckout,
  setSort,
} = chatSlice.actions;
export default chatSlice.reducer;
