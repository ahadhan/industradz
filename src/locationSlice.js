import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    latitude: null,
    longitude: null,
    address: '',
  },
  reducers: {
    setLatitude(state, action) {
      state.latitude = action.payload;
    },
    setLongitude(state, action) {
      state.longitude = action.payload;
    },
    locationAddressData(state, action) {
      state.address = action.payload;
    },
  },
});

export const { setLatitude, setLongitude, locationAddressData } = locationSlice.actions;

export default locationSlice.reducer;
