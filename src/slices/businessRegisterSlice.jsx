// src/slices/businessRegisterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const businessRegisterSlice = createSlice({
  name: 'businessRegister',
  initialState: {
    isBusinessRegister: false, // Initially, user hasn't registered business
  },
  reducers: {
    setBusinessRegistered: (state) => {
      state.isBusinessRegister = true;
    },
    resetBusinessRegistered: (state) => {
      state.isBusinessRegister = false;
    },
  },
});

export const { setBusinessRegistered, resetBusinessRegistered } = businessRegisterSlice.actions;
export default businessRegisterSlice.reducer;
