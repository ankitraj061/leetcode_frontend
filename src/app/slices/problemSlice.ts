import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../utils/axiosClient";

export const getProblem = createAsyncThunk(
  "problem/get",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/api/user/problem/${slug}`);
      return { problem: response.data.problem, slug };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    problem: null as any,
    loading: false,
    error: null as any,
    fetchedSlug: null as string | null,  // 👈 add this
  },
  reducers: {
    clearProblem: (state) => {
      state.problem = null;
      state.error = null;
      state.fetchedSlug = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problem = action.payload.problem;
        state.fetchedSlug = action.payload.slug;
      })
      .addCase(getProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProblem } = problemSlice.actions;
export default problemSlice.reducer;
