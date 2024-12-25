// import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
// import locationReducer from './slices/locationSlice'; 
// import businessRegisterReducer from './slices/businessRegisterSlice'; 



// export const fetchDropdownOptions = createAsyncThunk("dropdown/fetchOptions", async () => {
//   const response = await axios.get("https://industradz-backend-new.onrender.com/api/dynamic-fields");
//   return response.data.options; // Adjust based on API response structure
// });




// const store = configureStore({
//   reducer: {
//     location: locationReducer, 
//     businessRegister: businessRegisterReducer,
//   },
// });

// export default store;






import dynamicFieldsReducer from "./slices/dynamicFieldsSlice";
import locationReducer from "./slices/locationSlice";
import businessRegisterReducer from "./slices/businessRegisterSlice";
import modalReducer from "./slices/modalSlice";
import serviceMenuReducer from './slices/serviceMenuSlice';
import { configureStore } from "@reduxjs/toolkit";



const store = configureStore({
  reducer: {
    location: locationReducer,
    businessRegister: businessRegisterReducer,
    dynamicFields: dynamicFieldsReducer, 
    modal: modalReducer,
    serviceMenu: serviceMenuReducer,
  },
});

export default store;
