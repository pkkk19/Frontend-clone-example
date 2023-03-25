import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "../../services/axios";
export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (params) => {
    const response = await axiosService.get("/rest/categories/paginate", {
      params,
    });
    return {
      data: response.data.data,
      totalPages: response.data.length,
    };
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryList: [],
    total: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.categoryList = action.payload.data;
      state.total = action.payload.totalPages;
    });
  },
});

export default categorySlice.reducer;
