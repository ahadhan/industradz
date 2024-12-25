// slices/serviceMenuSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  industrialOffering: [], // List of registered industrial services
  spareParts: [], // List of registered spare parts services
  rawMaterials: [], // List of raw material services
};

const serviceMenuSlice = createSlice({
  name: 'serviceMenu',
  initialState,
  reducers: {
    addIndustrialOffering(state, action) {
      state.industrialOffering.push(action.payload);
    },
    addSparePart(state, action) {
      state.spareParts.push(action.payload);
    },
    addRawMaterial(state, action) {
      state.rawMaterials.push(action.payload);
    },
    resetServiceMenu(state) {
      state.industrialOffering = [];
      state.spareParts = [];
      state.rawMaterials = [];
    },
  },
});

export const { addIndustrialOffering, addSparePart, addRawMaterial, resetServiceMenu } = serviceMenuSlice.actions;

export default serviceMenuSlice.reducer;
