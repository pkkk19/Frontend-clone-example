import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const viewedNotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addToViewed(state, action) {
      const include = state.data.findIndex((item) => item === action.payload);
      if (!(include >= 0)) {
        state.data.push(action.payload);
      }
    },
    markAllList(state, action) {
      if (state.data.length < action.payload.length)
        state.data.push(...action.payload);
    },
  },
});

export const { addToViewed, markAllList } = viewedNotificationSlice.actions;

export default viewedNotificationSlice.reducer;
