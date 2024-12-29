// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import Select from "react-select";
// import { useCookies } from "react-cookie"; // Import useCookies

// // Define options for enums
// const conditionOptions = [
//   { value: "New", label: "New" },
//   { value: "Used", label: "Used" },
//   { value: "Refurbished", label: "Refurbished" },
// ];

// const availabilityOptions = [
//   { value: "In Stock", label: "In Stock" },
//   { value: "Out of Stock", label: "Out of Stock" },
//   { value: "Available on Order", label: "Available on Order" },
// ];

// const financingOptionsList = [
//   "Bank Loans",
//   "Leasing",
//   "Supplier Credit",
//   "Self-Financing",
//   "Government Subsidies",
//   "Investment Funds",
//   "Islamic Financing",
//   "Export Credit Agencies",
//   "Commercial Credit Lines",
//   "Crowdfunding",
//   "Equipment Financing Programs",
//   "Private Investors",
//   "Joint Ventures",
//   "Trade Agreements with Deferred Payment Options",
//   "Factoring Services",
// ];

// // Define days for working hours if needed
// const daysOptions = [
//   { value: "Monday", label: "Monday" },
//   { value: "Tuesday", label: "Tuesday" },
//   { value: "Wednesday", label: "Wednesday" },
//   { value: "Thursday", label: "Thursday" },
//   { value: "Friday", label: "Friday" },
//   { value: "Saturday", label: "Saturday" },
//   { value: "Sunday", label: "Sunday" },
// ];

// const IndustrialMachinesOffering = () => {
//   const navigate = useNavigate();
//   const [cookies, setCookie, removeCookie] = useCookies(['token']); // Access token and removeCookie
//   const [formData, setFormData] = useState({
//     machine_name: "",
//     machine_des: "",
//     machine_type: "",
//     condition: "",
//     brand: "",
//     model: "",
//     model_year: "",
//     fixed_price: false,
//     negotiable_price: true,
//     price: "",
//     currency: "DZD",
//     location_country: "",
//     machine_images: [],
//     location_city: "",
//     FuelType: "",
//     power: {
//       amount: "",
//       unit: "Watt",
//     },
//     dimensions: "",
//     productionCapacity: {
//       amount: "",
//       unit: "tons/hour",
//     },
//     weight: {
//       amount: "",
//       unit: "kg",
//     },
//     availability: "In Stock",
//     warranty: {
//       amount: "",
//       unit: "years",
//     },
//     financingOptions: "",
//     after_sales_service: false,
//     accessories_included: false,
//     spare_parts_available: false,
//   });

//   const [loading, setLoading] = useState(false);

//   // Handle input changes, including nested fields
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const keys = name.split('.');

//     if (keys.length === 1) {
//       // Top-level field
//       if (type === "checkbox") {
//         setFormData((prevData) => ({ ...prevData, [name]: checked }));
//       } else {
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//       }
//     } else if (keys.length === 2) {
//       // Nested field
//       const [parent, child] = keys;
//       if (type === "checkbox") {
//         setFormData((prevData) => ({
//           ...prevData,
//           [parent]: { ...prevData[parent], [child]: checked },
//         }));
//       } else {
//         setFormData((prevData) => ({
//           ...prevData,
//           [parent]: { ...prevData[parent], [child]: value },
//         }));
//       }
//     }
//   };

//   // Handle Select dropdown changes for non-multi-select fields
//   const handleSelectChange = (selectedOption, { name }) => {
//     setFormData((prevData) => ({ ...prevData, [name]: selectedOption.value }));
//   };

//   // Handle Select changes for multi-select fields (if any)
//   const handleMultiSelectChange = (selectedOptions, { name }) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData((prevData) => ({ ...prevData, [name]: values }));
//   };

//   // Handle file input
//   const handleFileChange = (e) => {
//     const files = e.target.files;
//     if (files) {
//       setFormData((prevData) => ({ ...prevData, machine_images: Array.from(files) }));
//     }
//   };

//   // Function to convert time to 12-hour format (if needed)
//   const convertTo12HourFormat = (time24) => {
//     const [hour, minute] = time24.split(":");
//     let hour12 = parseInt(hour, 10);
//     const ampm = hour12 >= 12 ? "PM" : "AM";
//     hour12 = hour12 % 12 || 12;
//     return `${hour12}:${minute} ${ampm}`;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const token = cookies.token; // Retrieve token from cookies

//     if (!token) {
//       toast.error("You are not logged in. Please log in first.");
//       setLoading(false);
//       navigate("/login"); // Redirect to login page
//       return;
//     }

//     // Validate required fields
//     const requiredFields = [
//       'machine_name',
//       'machine_des',
//       'machine_type',
//       'condition',
//       'price',
//       'location_country',
//       'power.amount',
//       'power.unit',
//       'productionCapacity.amount',
//       'productionCapacity.unit',
//       'weight.amount',
//       'weight.unit',
//       'warranty.amount',
//       'warranty.unit',
//     ];

//     let isValid = true;
//     requiredFields.forEach(field => {
//       const keys = field.split('.');
//       let value = formData;
//       keys.forEach(key => {
//         value = value[key];
//       });
//       if (!value) {
//         isValid = false;
//         toast.error(`Please fill in the ${field.replace('.', ' ')} field.`);
//       }
//     });

//     if (!isValid) {
//       setLoading(false);
//       return;
//     }

//     const machineData = new FormData();
//     machineData.append("machine_name", formData.machine_name);
//     machineData.append("machine_des", formData.machine_des);
//     machineData.append("machine_type", formData.machine_type);
//     machineData.append("condition", formData.condition);
//     machineData.append("brand", formData.brand);
//     machineData.append("model", formData.model);
//     machineData.append("model_year", formData.model_year);
//     machineData.append("fixed_price", formData.fixed_price);
//     machineData.append("negotiable_price", formData.negotiable_price);
//     machineData.append("price", formData.price);
//     machineData.append("currency", formData.currency);
//     machineData.append("location_country", formData.location_country);
//     machineData.append("location_city", formData.location_city);
//     machineData.append("FuelType", formData.FuelType);
//     machineData.append("dimensions", formData.dimensions);
//     machineData.append("availability", formData.availability);
//     machineData.append("financingOptions", formData.financingOptions);
//     machineData.append("after_sales_service", formData.after_sales_service);
//     machineData.append("accessories_included", formData.accessories_included);
//     machineData.append("spare_parts_available", formData.spare_parts_available);

//     // Append nested objects
//     machineData.append("power.amount", formData.power.amount);
//     machineData.append("power.unit", formData.power.unit);
//     machineData.append("productionCapacity.amount", formData.productionCapacity.amount);
//     machineData.append("productionCapacity.unit", formData.productionCapacity.unit);
//     machineData.append("weight.amount", formData.weight.amount);
//     machineData.append("weight.unit", formData.weight.unit);
//     machineData.append("warranty.amount", formData.warranty.amount);
//     machineData.append("warranty.unit", formData.warranty.unit);

//     // Append images
//     formData.machine_images.forEach((image, index) => {
//       machineData.append("machine_images", image);
//     });

//     try {
//       // Replace the placeholder URL with your actual API endpoint
//       const apiUrl = "https://your-backend-api.com/api/industrial-machines-offering"; // Replace with your API URL

//       const response = await axios.post(apiUrl, machineData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.success) {
//         toast.success(response.data.message || "Industrial Machine registered successfully!");
//         navigate("/dashboard/machines"); // Redirect to machines dashboard or desired page
//       } else {
//         toast.error(response.data.message || "Failed to register industrial machine.");
//       }
//     } catch (error) {
//       console.error(error);
//       if (error.response?.data?.error === "Invalid token") {
//         toast.error("Session expired or invalid. Please log in again.");
//         removeCookie('token'); // Remove the 'token' cookie
//         navigate("/login"); // Redirect to login page
//       } else {
//         toast.error(error.response?.data?.message || "Failed to register industrial machine.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-2xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <h2 className="text-xl font-bold mb-4 text-orange">Register Industrial Machine</h2>
//       {loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <div className="loader">
//             <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Machine Name */}
//           <div>
//             <label htmlFor="machine_name" className="block text-sm font-medium">Machine Name<span className="text-red-500">*</span></label>
//             <input
//               id="machine_name"
//               type="text"
//               name="machine_name"
//               value={formData.machine_name}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Machine Description */}
//           <div>
//             <label htmlFor="machine_des" className="block text-sm font-medium">Machine Description<span className="text-red-500">*</span></label>
//             <textarea
//               id="machine_des"
//               name="machine_des"
//               value={formData.machine_des}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Machine Type */}
//           <div>
//             <label htmlFor="machine_type" className="block text-sm font-medium">Machine Type<span className="text-red-500">*</span></label>
//             <input
//               id="machine_type"
//               type="text"
//               name="machine_type"
//               value={formData.machine_type}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Condition */}
//           <div>
//             <label htmlFor="condition" className="block text-sm font-medium">Condition<span className="text-red-500">*</span></label>
//             <Select
//               id="condition"
//               name="condition"
//               options={conditionOptions}
//               value={conditionOptions.find(option => option.value === formData.condition) || null}
//               onChange={handleSelectChange}
//               className="w-full"
//               placeholder="Select Condition"
//               isClearable
//               required
//             />
//           </div>

//           {/* Brand */}
//           <div>
//             <label htmlFor="brand" className="block text-sm font-medium">Brand</label>
//             <input
//               id="brand"
//               type="text"
//               name="brand"
//               value={formData.brand}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Model */}
//           <div>
//             <label htmlFor="model" className="block text-sm font-medium">Model</label>
//             <input
//               id="model"
//               type="text"
//               name="model"
//               value={formData.model}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Model Year */}
//           <div>
//             <label htmlFor="model_year" className="block text-sm font-medium">Model Year</label>
//             <input
//               id="model_year"
//               type="number"
//               name="model_year"
//               value={formData.model_year}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               min="1900"
//               max={new Date().getFullYear()}
//             />
//           </div>

//           {/* Pricing */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Fixed Price */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="fixed_price"
//                 checked={formData.fixed_price}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-orange border-gray-300 rounded"
//               />
//               <label htmlFor="fixed_price" className="ml-2 block text-sm font-medium">Fixed Price</label>
//             </div>

//             {/* Negotiable Price */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="negotiable_price"
//                 checked={formData.negotiable_price}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-orange border-gray-300 rounded"
//               />
//               <label htmlFor="negotiable_price" className="ml-2 block text-sm font-medium">Negotiable Price</label>
//             </div>
//           </div>

//           {/* Price */}
//           <div>
//             <label htmlFor="price" className="block text-sm font-medium">Price<span className="text-red-500">*</span></label>
//             <input
//               id="price"
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>

//           {/* Currency */}
//           <div>
//             <label htmlFor="currency" className="block text-sm font-medium">Currency</label>
//             <input
//               id="currency"
//               type="text"
//               name="currency"
//               value={formData.currency}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               placeholder="DZD"
//             />
//           </div>

//           {/* Location Country */}
//           <div>
//             <label htmlFor="location_country" className="block text-sm font-medium">Location Country<span className="text-red-500">*</span></label>
//             <input
//               id="location_country"
//               type="text"
//               name="location_country"
//               value={formData.location_country}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Location City */}
//           <div>
//             <label htmlFor="location_city" className="block text-sm font-medium">Location City</label>
//             <input
//               id="location_city"
//               type="text"
//               name="location_city"
//               value={formData.location_city}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Fuel Type */}
//           <div>
//             <label htmlFor="FuelType" className="block text-sm font-medium">Fuel Type</label>
//             <input
//               id="FuelType"
//               type="text"
//               name="FuelType"
//               value={formData.FuelType}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Power */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Power Amount */}
//             <div>
//               <label htmlFor="power.amount" className="block text-sm font-medium">Power Amount<span className="text-red-500">*</span></label>
//               <input
//                 id="power.amount"
//                 type="number"
//                 name="power.amount"
//                 value={formData.power.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Power Unit */}
//             <div>
//               <label htmlFor="power.unit" className="block text-sm font-medium">Power Unit<span className="text-red-500">*</span></label>
//               <input
//                 id="power.unit"
//                 type="text"
//                 name="power.unit"
//                 value={formData.power.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="Watt"
//               />
//             </div>
//           </div>

//           {/* Dimensions */}
//           <div>
//             <label htmlFor="dimensions" className="block text-sm font-medium">Dimensions</label>
//             <input
//               id="dimensions"
//               type="text"
//               name="dimensions"
//               value={formData.dimensions}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Production Capacity */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Production Capacity Amount */}
//             <div>
//               <label htmlFor="productionCapacity.amount" className="block text-sm font-medium">Production Capacity Amount<span className="text-red-500">*</span></label>
//               <input
//                 id="productionCapacity.amount"
//                 type="number"
//                 name="productionCapacity.amount"
//                 value={formData.productionCapacity.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Production Capacity Unit */}
//             <div>
//               <label htmlFor="productionCapacity.unit" className="block text-sm font-medium">Production Capacity Unit<span className="text-red-500">*</span></label>
//               <input
//                 id="productionCapacity.unit"
//                 type="text"
//                 name="productionCapacity.unit"
//                 value={formData.productionCapacity.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="tons/hour"
//               />
//             </div>
//           </div>

//           {/* Weight */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Weight Amount */}
//             <div>
//               <label htmlFor="weight.amount" className="block text-sm font-medium">Weight Amount<span className="text-red-500">*</span></label>
//               <input
//                 id="weight.amount"
//                 type="number"
//                 name="weight.amount"
//                 value={formData.weight.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Weight Unit */}
//             <div>
//               <label htmlFor="weight.unit" className="block text-sm font-medium">Weight Unit<span className="text-red-500">*</span></label>
//               <input
//                 id="weight.unit"
//                 type="text"
//                 name="weight.unit"
//                 value={formData.weight.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="kg"
//               />
//             </div>
//           </div>

//           {/* Availability */}
//           <div>
//             <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
//             <Select
//               id="availability"
//               name="availability"
//               options={availabilityOptions}
//               value={availabilityOptions.find(option => option.value === formData.availability) || null}
//               onChange={handleSelectChange}
//               className="w-full"
//               placeholder="Select Availability"
//               isClearable
//             />
//           </div>

//           {/* Warranty */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Warranty Amount */}
//             <div>
//               <label htmlFor="warranty.amount" className="block text-sm font-medium">Warranty Amount<span className="text-red-500">*</span></label>
//               <input
//                 id="warranty.amount"
//                 type="number"
//                 name="warranty.amount"
//                 value={formData.warranty.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Warranty Unit */}
//             <div>
//               <label htmlFor="warranty.unit" className="block text-sm font-medium">Warranty Unit<span className="text-red-500">*</span></label>
//               <input
//                 id="warranty.unit"
//                 type="text"
//                 name="warranty.unit"
//                 value={formData.warranty.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="years"
//               />
//             </div>
//           </div>

//           {/* Financing Options */}
//           <div>
//             <label htmlFor="financingOptions" className="block text-sm font-medium">Financing Options</label>
//             <Select
//               id="financingOptions"
//               name="financingOptions"
//               options={financingOptionsList.map(option => ({ value: option, label: option }))}
//               value={formData.financingOptions ? { value: formData.financingOptions, label: formData.financingOptions } : null}
//               onChange={handleSelectChange}
//               className="w-full"
//               placeholder="Select Financing Options"
//               isClearable
//             />
//           </div>

//           {/* After Sales Service */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="after_sales_service"
//               checked={formData.after_sales_service}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-orange border-gray-300 rounded"
//             />
//             <label htmlFor="after_sales_service" className="ml-2 block text-sm font-medium">After Sales Service</label>
//           </div>

//           {/* Accessories Included */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="accessories_included"
//               checked={formData.accessories_included}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-orange border-gray-300 rounded"
//             />
//             <label htmlFor="accessories_included" className="ml-2 block text-sm font-medium">Accessories Included</label>
//           </div>

//           {/* Spare Parts Available */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="spare_parts_available"
//               checked={formData.spare_parts_available}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-orange border-gray-300 rounded"
//             />
//             <label htmlFor="spare_parts_available" className="ml-2 block text-sm font-medium">Spare Parts Available</label>
//           </div>

//           {/* Machine Images */}
//           <div>
//             <label htmlFor="machine_images" className="block text-sm font-medium">Machine Images</label>
//             <input
//               id="machine_images"
//               type="file"
//               name="machine_images"
//               multiple
//               onChange={handleFileChange}
//               className="w-full border rounded px-3 py-2"
//               accept="image/*"
//             />
//             {/* Image Previews */}
//             <div className="flex flex-wrap mt-2">
//               {formData.machine_images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={URL.createObjectURL(image)}
//                   alt={`Preview ${index}`}
//                   className="w-24 h-24 object-cover mr-2 mb-2"
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
//             disabled={loading}
//           >
//             {loading ? "Registering..." : "Register Machine"}
//           </button>
//         </form>
//       )}
//     </motion.div>
//   );
// };

// export default IndustrialMachinesOffering;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { fetchDynamicFields } from "../../../../slices/dynamicFieldsSlice"; // Adjust the path accordingly

const IndustrialMachinesOffering = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access dynamic fields from Redux store
  const {
    data: dynamicData,
    loading: fieldsLoading,
    error: fieldsError,
  } = useSelector((state) => state.dynamicFields);

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const [formData, setFormData] = useState({
    machine_name: "",
    machine_des: "",
    machine_type: "",
    condition: "",
    brand: "",
    model: "",
    model_year: "",
    fixed_price: false,
    negotiable_price: true,
    price: "",
    currency: "DZD",
    location_country: "",
    machine_images: [],
    location_city: "",
    FuelType: "",
    power: {
      amount: "",
      unit: "Watt",
    },
    dimensions: "",
    productionCapacity: {
      amount: "",
      unit: "tons/hour",
    },
    weight: {
      amount: "",
      unit: "kg",
    },
    availability: "In Stock",
    warranty: {
      amount: "",
      unit: "years",
    },
    financingOptions: "",
    after_sales_service: false,
    accessories_included: false,
    spare_parts_available: false,
    spare_parts_subcategory: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch dynamic fields on component mount
  useEffect(() => {
    dispatch(fetchDynamicFields());
  }, [dispatch]);

  // Handle input changes, including nested fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      // Top-level field
      if (type === "checkbox") {
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (keys.length === 2) {
      // Nested field
      const [parent, child] = keys;
      if (type === "checkbox") {
        setFormData((prevData) => ({
          ...prevData,
          [parent]: { ...prevData[parent], [child]: checked },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [parent]: { ...prevData[parent], [child]: value },
        }));
      }
    }
  };

  // Handle Select dropdown changes for non-multi-select fields
  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  // Handle file input
  const [selectedImages, setSelectedImages] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      // Optional: Add client-side validation for file types and sizes here
      setSelectedImages(Array.from(files));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = cookies.token; // Retrieve token from cookies

    if (!token) {
      toast.error("You are not logged in. Please log in first.");
      setLoading(false);
      navigate("/login"); // Redirect to login page
      return;
    }

    // Validate required fields
    const requiredFields = [
      'machine_name',
      'machine_des',
      'machine_type',
      'condition',
      'price',
      'location_country',
      'power.amount',
      'power.unit',
      'productionCapacity.amount',
      'productionCapacity.unit',
      'weight.amount',
      'weight.unit',
      'warranty.amount',
      'warranty.unit',
    ];

    let isValid = true;
    requiredFields.forEach(field => {
      const keys = field.split('.');
      let value = formData;
      keys.forEach(key => {
        value = value[key];
      });
      if (value === "" || value === null || value === undefined) { // Allow 0 as valid input
        isValid = false;
        toast.error(`Please fill in the ${field.replace('.', ' ')} field.`);
      }
    });

    // Additional validation for subcategory if Spare Parts is selected
    if (formData.spare_parts_available && !formData.spare_parts_subcategory) {
      isValid = false;
      toast.error("Please select the Spare Parts Subcategory.");
    }

    // Validate machine_images (at least one image required)
    if (selectedImages.length === 0) {
      isValid = false;
      toast.error("Please upload at least one machine image.");
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      // Prepare FormData
      const submissionData = new FormData();
      submissionData.append("machine_name", formData.machine_name);
      submissionData.append("machine_des", formData.machine_des);
      submissionData.append("machine_type", formData.machine_type);
      submissionData.append("condition", formData.condition);
      submissionData.append("brand", formData.brand);
      submissionData.append("model", formData.model);
      submissionData.append("model_year", formData.model_year);
      submissionData.append("fixed_price", formData.fixed_price);
      submissionData.append("negotiable_price", formData.negotiable_price);
      submissionData.append("price", formData.price);
      submissionData.append("currency", formData.currency);
      submissionData.append("location_country", formData.location_country);
      submissionData.append("location_city", formData.location_city);
      submissionData.append("FuelType", formData.FuelType);
      submissionData.append("power.amount", formData.power.amount);
      submissionData.append("power.unit", formData.power.unit);
      submissionData.append("dimensions", formData.dimensions);
      submissionData.append("productionCapacity.amount", formData.productionCapacity.amount);
      submissionData.append("productionCapacity.unit", formData.productionCapacity.unit);
      submissionData.append("weight.amount", formData.weight.amount);
      submissionData.append("weight.unit", formData.weight.unit);
      submissionData.append("availability", formData.availability);
      submissionData.append("warranty.amount", formData.warranty.amount);
      submissionData.append("warranty.unit", formData.warranty.unit);
      submissionData.append("financingOptions", formData.financingOptions);
      submissionData.append("after_sales_service", formData.after_sales_service);
      submissionData.append("accessories_included", formData.accessories_included);
      submissionData.append("spare_parts_available", formData.spare_parts_available);
      if (formData.spare_parts_available) {
        submissionData.append("spare_parts_subcategory", formData.spare_parts_subcategory);
      }

      // Append image files
      selectedImages.forEach((image, index) => {
        submissionData.append("machine_images", image);
      });
      console.log(cookies.token)
      // Send data to backend
      const apiUrl = ` https://industradz-backend-new.onrender.com/api/machinery`; // Ensure these env variables are set

      const response = await axios.post(apiUrl, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Industrial Machine registered successfully!");
        console.log(response)
        navigate("/dashboard/services/marketplace/industrial-machines"); // Redirect to machines dashboard or desired page

      } else {
        toast.error(response.data.message || "Failed to register industrial machine.");
        console.log(response.data.message || "Failed to register industrial machine.")
      }
    } catch (error) {
      console.error(error);
      
      if (error.response?.data?.error === "Invalid token") {
        toast.error("Session expired or invalid. Please log in again.");
        removeCookie('token'); // Remove the 'token' cookie
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(error.response?.data?.message || "Failed to register industrial machine.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-500">Register Industrial Machine</h2>
      {(loading || fieldsLoading) ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {fieldsError && (
            <div className="text-red-500 mb-4">
              Failed to load dynamic fields: {fieldsError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Machine Name */}
            <div>
              <label htmlFor="machine_name" className="block text-sm font-medium">
                Machine Name<span className="text-red-500">*</span>
              </label>
              <input
                id="machine_name"
                type="text"
                name="machine_name"
                value={formData.machine_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Machine Description */}
            <div>
              <label htmlFor="machine_des" className="block text-sm font-medium">
                Machine Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="machine_des"
                name="machine_des"
                value={formData.machine_des}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Machine Type */}
            <div>
              <label htmlFor="machine_type" className="block text-sm font-medium">
                Machine Type<span className="text-red-500">*</span>
              </label>
              <Select
                id="machine_type"
                name="machine_type"
                options={Array.isArray(dynamicData.machine_types) ? dynamicData.machine_types.map(type => ({ value: type, label: type })) : []}
                value={Array.isArray(dynamicData.machine_types) && formData.machine_type ? { value: formData.machine_type, label: formData.machine_type } : null}
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Machine Type"
                isClearable
                required
              />
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium">
                Condition<span className="text-red-500">*</span>
              </label>
              <Select
                id="condition"
                name="condition"
                options={[
                  { value: "New", label: "New" },
                  { value: "Used", label: "Used" },
                  { value: "Refurbished", label: "Refurbished" },
                ]}
                value={
                  ["New", "Used", "Refurbished"].includes(formData.condition)
                    ? { value: formData.condition, label: formData.condition }
                    : null
                }
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Condition"
                isClearable
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium">
                Brand
              </label>
              <Select
                id="brand"
                name="brand"
                options={Array.isArray(dynamicData.machine_brands) ? dynamicData.machine_brands.map(brand => ({ value: brand, label: brand })) : []}
                value={Array.isArray(dynamicData.machine_brands) && formData.brand ? { value: formData.brand, label: formData.brand } : null}
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Brand"
                isClearable
              />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium">
                Model
              </label>
              <Select
                id="model"
                name="model"
                options={Array.isArray(dynamicData.machine_models) ? dynamicData.machine_models.map(model => ({ value: model, label: model })) : []}
                value={Array.isArray(dynamicData.machine_models) && formData.model ? { value: formData.model, label: formData.model } : null}
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Model"
                isClearable
              />
            </div>

            {/* Model Year */}
            <div>
              <label htmlFor="model_year" className="block text-sm font-medium">
                Model Year
              </label>
              <input
                id="model_year"
                type="number"
                name="model_year"
                value={formData.model_year}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              {/* Fixed Price */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="fixed_price"
                  checked={formData.fixed_price}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="fixed_price" className="ml-2 block text-sm font-medium">
                  Fixed Price
                </label>
              </div>

              {/* Negotiable Price */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="negotiable_price"
                  checked={formData.negotiable_price}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="negotiable_price" className="ml-2 block text-sm font-medium">
                  Negotiable Price
                </label>
              </div>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium">
                Price<span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Currency */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium">
                Currency
              </label>
              <Select
                id="currency"
                name="currency"
                options={[
                  { value: "EUR", label: "Euro (EUR)" },
                  { value: "DZD", label: "Algerian Dinar (DZD)" },
                  // Add more currency options if needed
                ]}
                value={
                  [
                    { value: "EUR", label: "Euro (EUR)" },
                    { value: "DZD", label: "Algerian Dinar (DZD)" },
                  ].find(
                    (option) => option.value === formData.currency
                  ) || null
                }
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Currency"
                isClearable
              />
            </div>

            {/* Location Country */}
            <div>
              <label htmlFor="location_country" className="block text-sm font-medium">
                Location Country<span className="text-red-500">*</span>
              </label>
              <input
                id="location_country"
                type="text"
                name="location_country"
                value={formData.location_country}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Location City */}
            <div>
              <label htmlFor="location_city" className="block text-sm font-medium">
                Location City
              </label>
              <input
                id="location_city"
                type="text"
                name="location_city"
                value={formData.location_city}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label htmlFor="FuelType" className="block text-sm font-medium">
                Fuel Type
              </label>
              <input
                id="FuelType"
                type="text"
                name="FuelType"
                value={formData.FuelType}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Power */}
            <div className="grid grid-cols-2 gap-4">
              {/* Power Amount */}
              <div>
                <label htmlFor="power.amount" className="block text-sm font-medium">
                  Power Amount<span className="text-red-500">*</span>
                </label>
                <input
                  id="power.amount"
                  type="number"
                  name="power.amount"
                  value={formData.power.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Power Unit */}
              <div>
                <label htmlFor="power.unit" className="block text-sm font-medium">
                  Power Unit<span className="text-red-500">*</span>
                </label>
                <input
                  id="power.unit"
                  type="text"
                  name="power.unit"
                  value={formData.power.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="Watt"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium">
                Dimensions
              </label>
              <input
                id="dimensions"
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Production Capacity */}
            <div className="grid grid-cols-2 gap-4">
              {/* Production Capacity Amount */}
              <div>
                <label htmlFor="productionCapacity.amount" className="block text-sm font-medium">
                  Production Capacity Amount<span className="text-red-500">*</span>
                </label>
                <input
                  id="productionCapacity.amount"
                  type="number"
                  name="productionCapacity.amount"
                  value={formData.productionCapacity.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Production Capacity Unit */}
              <div>
                <label htmlFor="productionCapacity.unit" className="block text-sm font-medium">
                  Production Capacity Unit<span className="text-red-500">*</span>
                </label>
                <input
                  id="productionCapacity.unit"
                  type="text"
                  name="productionCapacity.unit"
                  value={formData.productionCapacity.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="tons/hour"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weight Amount */}
              <div>
                <label htmlFor="weight.amount" className="block text-sm font-medium">
                  Weight Amount<span className="text-red-500">*</span>
                </label>
                <input
                  id="weight.amount"
                  type="number"
                  name="weight.amount"
                  value={formData.weight.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Weight Unit */}
              <div>
                <label htmlFor="weight.unit" className="block text-sm font-medium">
                  Weight Unit<span className="text-red-500">*</span>
                </label>
                <input
                  id="weight.unit"
                  type="text"
                  name="weight.unit"
                  value={formData.weight.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="kg"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium">
                Availability
              </label>
              <Select
                id="availability"
                name="availability"
                options={[
                  { value: "In Stock", label: "In Stock" },
                  { value: "Out of Stock", label: "Out of Stock" },
                  { value: "Available on Order", label: "Available on Order" },
                ]}
                value={
                  ["In Stock", "Out of Stock", "Available on Order"].includes(formData.availability)
                    ? { value: formData.availability, label: formData.availability }
                    : null
                }
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Availability"
                isClearable
              />
            </div>

            {/* Warranty */}
            <div className="grid grid-cols-2 gap-4">
              {/* Warranty Amount */}
              <div>
                <label htmlFor="warranty.amount" className="block text-sm font-medium">
                  Warranty Amount<span className="text-red-500">*</span>
                </label>
                <input
                  id="warranty.amount"
                  type="number"
                  name="warranty.amount"
                  value={formData.warranty.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Warranty Unit */}
              <div>
                <label htmlFor="warranty.unit" className="block text-sm font-medium">
                  Warranty Unit<span className="text-red-500">*</span>
                </label>
                <input
                  id="warranty.unit"
                  type="text"
                  name="warranty.unit"
                  value={formData.warranty.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="years"
                />
              </div>
            </div>

            {/* Financing Options */}
            <div>
              <label htmlFor="financingOptions" className="block text-sm font-medium">
                Financing Options
              </label>
              <Select
                id="financingOptions"
                name="financingOptions"
                options={[
                  "Bank Loans",
                  "Leasing",
                  "Supplier Credit",
                  "Self-Financing",
                  "Government Subsidies",
                  "Investment Funds",
                  "Islamic Financing",
                  "Export Credit Agencies",
                  "Commercial Credit Lines",
                  "Crowdfunding",
                  "Equipment Financing Programs",
                  "Private Investors",
                  "Joint Ventures",
                  "Trade Agreements with Deferred Payment Options",
                  "Factoring Services",
                ].map(option => ({ value: option, label: option }))}
                value={formData.financingOptions ? { value: formData.financingOptions, label: formData.financingOptions } : null}
                onChange={handleSelectChange}
                className="mt-1"
                placeholder="Select Financing Options"
                isClearable
              />
            </div>

            {/* After Sales Service */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="after_sales_service"
                checked={formData.after_sales_service}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="after_sales_service" className="ml-2 block text-sm font-medium">
                After Sales Service
              </label>
            </div>

            {/* Accessories Included */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="accessories_included"
                checked={formData.accessories_included}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="accessories_included" className="ml-2 block text-sm font-medium">
                Accessories Included
              </label>
            </div>

            {/* Spare Parts Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="spare_parts_available"
                checked={formData.spare_parts_available}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="spare_parts_available" className="ml-2 block text-sm font-medium">
                Spare Parts Available
              </label>
            </div>

            {/* Spare Parts Subcategory (Conditional Rendering) */}
            {formData.spare_parts_available && (
              <div>
                <label htmlFor="spare_parts_subcategory" className="block text-sm font-medium">
                  Spare Parts Subcategory<span className="text-red-500">*</span>
                </label>
                <Select
                  id="spare_parts_subcategory"
                  name="spare_parts_subcategory"
                  options={
                    Array.isArray(dynamicData.sparePartCategories)
                      ? dynamicData.sparePartCategories.flatMap(category => 
                          Array.isArray(category.subCategories) ? 
                            category.subCategories.map(sub => ({ 
                              value: sub, 
                              label: `${category.category} - ${sub}` 
                            })) 
                            : []
                        )
                      : []
                  }
                  value={formData.spare_parts_subcategory ? { value: formData.spare_parts_subcategory, label: formData.spare_parts_subcategory } : null}
                  onChange={handleSelectChange}
                  className="mt-1"
                  placeholder="Select Spare Parts Subcategory"
                  isClearable
                  required
                />
              </div>
            )}

            {/* Machine Images */}
            <div>
              <label htmlFor="machine_images" className="block text-sm font-medium">
                Machine Images<span className="text-red-500">*</span>
              </label>
              <input
                id="machine_images"
                type="file"
                name="machine_images"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                accept="image/*"
                required
              />
              {/* Image Previews */}
              <div className="flex flex-wrap mt-2">
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover mr-2 mb-2 rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Machine"}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default IndustrialMachinesOffering;
