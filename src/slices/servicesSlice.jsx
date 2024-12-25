// src/slices/servicesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    services: [
        {
            id: 1,
            name: "Carpenter Services",
            category: "Wood",
            price: 230.0,
            description: "Expert carpenter services for all your wood-related needs.",
            coverImage: "https://via.placeholder.com/400x300",
            bookings: 8,
            revenue: 24124,
        },
        // Add more initial services as needed
    ],
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        addService: (state, action) => {
            state.services.push(action.payload);
        },
        editService: (state, action) => {
            const index = state.services.findIndex(service => service.id === action.payload.id);
            if (index !== -1) {
                state.services[index] = action.payload;
            }
        },
        deleteService: (state, action) => {
            state.services = state.services.filter(service => service.id !== action.payload);
        },
        setServices: (state, action) => {
            state.services = action.payload;
        },
    },
});

export const { addService, editService, deleteService, setServices } = servicesSlice.actions;

export default servicesSlice.reducer;
