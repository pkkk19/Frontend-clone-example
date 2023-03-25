// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosService from "../../services/axios";

export const getBanners = createAsyncThunk("banners/getBanners", async () => {
  const response = await axiosService.get("/rest/banners/paginate", {
    params: { type: "banner", perPage: 5 },
  });
  return {
    data: response.data,
    totalPages: response.data.length,
  };
});

export const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    data: [],
    total: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBanners.fulfilled, (state, action) => {
      state.data = action.payload.data.data;
      state.total = action.payload.totalPages;
    });
  },
});

export default bannerSlice.reducer;
