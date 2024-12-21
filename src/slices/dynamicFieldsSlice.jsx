import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch dynamic fields
export const fetchDynamicFields = createAsyncThunk(
  "dynamicFields/fetchFields",
  async () => {
    const response = await axios.get("https://industradz-backend-new.onrender.com/api/dynamic-fields");
    console.log("Full API Response:", response.data.data); // Log the full response for debugging
    return response.data.data; // Return the full data object
  }
);

const dynamicFieldsSlice = createSlice({
  name: "dynamicFields",
  initialState: {
    data: {}, // Store the entire data object
    loading: false,
    error: null,
  },
  reducers: {}, // No additional reducers needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchDynamicFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDynamicFields.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store the full data object
      })
      .addCase(fetchDynamicFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dynamicFieldsSlice.reducer;
