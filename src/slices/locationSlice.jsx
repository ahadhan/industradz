// src/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: null,
  latitude: null,
  longitude: null,
  address: '',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLatitude: (state, action) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action) => {
      state.longitude = action.payload;
    },
    locationAddressData: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setLatitude, setLongitude, locationAddressData } = locationSlice.actions;
export default locationSlice.reducer;
