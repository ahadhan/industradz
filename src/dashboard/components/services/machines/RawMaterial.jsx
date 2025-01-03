
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import Select from "react-select";
// import { useCookies } from "react-cookie"; // Import useCookies

// // Define options for enums
// const formOptions = [
//   { value: "Tubes", label: "Tubes" },
//   { value: "Bars", label: "Bars" },
//   { value: "Sheets", label: "Sheets" },
//   { value: "Plates", label: "Plates" },
//   { value: "Wires", label: "Wires" },
//   { value: "Coils", label: "Coils" },
//   { value: "Pellets", label: "Pellets" },
//   { value: "Granules", label: "Granules" },
//   { value: "Rods", label: "Rods" },
//   { value: "Films", label: "Films" },
//   { value: "Foams", label: "Foams" },
//   { value: "Logs", label: "Logs" },
//   { value: "Planks", label: "Planks" },
//   { value: "Boards", label: "Boards" },
//   { value: "Veneers", label: "Veneers" },
//   { value: "Chips", label: "Chips" },
//   { value: "Sawdust", label: "Sawdust" },
//   { value: "Powders", label: "Powders" },
//   { value: "Fabrics", label: "Fabrics" },
//   { value: "Yarns", label: "Yarns" },
//   { value: "Threads", label: "Threads" },
//   { value: "Liquids", label: "Liquids" },
//   { value: "Ores", label: "Ores" },
//   { value: "Aggregates", label: "Aggregates" },
//   { value: "Bricks", label: "Bricks" },
//   { value: "Blocks", label: "Blocks" },
//   { value: "Cement", label: "Cement" },
//   { value: "Concrete", label: "Concrete" },
// ];

// const availabilityOptions = [
//   { value: "In Stock", label: "In Stock" },
//   { value: "Available on Order", label: "Available on Order" },
// ];

// const RawMaterialOffering = () => {
//   const navigate = useNavigate();
//   const [cookies, setCookie, removeCookie] = useCookies(['token']); // Access token and removeCookie
//   const [formData, setFormData] = useState({
//     materialCategory: "",
//     name: "",
//     description: "",
//     form: "",
//     volume: {
//       amount: "",
//       unit: "",
//     },
//     industrialStandards: "",
//     purityLevel: "",
//     quantity: {
//       amount: "",
//       unit: "",
//     },
//     fixedPrice: true,
//     negotiablePrice: false,
//     price: {
//       amount: "",
//       unit: "",
//     },
//     currency: "DZD",
//     material_images: [],
//     locationCountry: "",
//     locationCity: "",
//     availability: "In Stock",
//     bulkDiscountsAvailable: false,
//     bulkDiscounts: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [fetchingFields, setFetchingFields] = useState(false); // Loading state for dynamic fields
//   const [categories, setCategories] = useState([]); // To store fetched categories
//   const [standards, setStandards] = useState([]); // To store fetched industrial standards

//   // Define maximum number of images allowed
//   const MAX_IMAGES = 5;

//   // Fetch dynamic fields from the API on component mount
//   useEffect(() => {
//     const fetchDynamicFields = async () => {
//       setFetchingFields(true);
//       try {
//         // Replace with your actual API endpoint
//         const apiUrl = "https://industradz-backend-new.onrender.com/api/dynamic-fields"; // Example URL
//         const response = await axios.get(apiUrl, {
//           headers: {
//             Authorization: `Bearer ${cookies.token}`,
//           },
//         });
        
//         if (response.data.success) {
//           const data = response.data.data;
//           setCategories(data.rawMaterialCategory); // Assuming rawMaterialCategory is an array of strings
//           setStandards(data.certifications); // Assuming certifications are used as industrial standards
//         } else {
//           toast.error(response.data.message || "Failed to fetch dynamic fields.");
//         }
//       } catch (error) {
//         console.error("Error fetching dynamic fields:", error);
//         toast.error("An error occurred while fetching dynamic fields.");
//       } finally {
//         setFetchingFields(false);
//       }
//     };

//     fetchDynamicFields();
//   }, [cookies.token]);

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

//   // Handle Select dropdown changes for single select fields
//   const handleSelectChange = (selectedOption, { name }) => {
//     setFormData((prevData) => ({ ...prevData, [name]: selectedOption ? selectedOption.value : "" }));
//   };

//   // Handle Select changes for multi-select fields
//   const handleMultiSelectChange = (selectedOptions, { name }) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData((prevData) => ({ ...prevData, [name]: values }));
//   };

//   // Handle file input with image limit
//   const handleFileChange = (e) => {
//     const files = e.target.files;
//     if (files) {
//       const selectedFiles = Array.from(files);
//       const totalImages = selectedFiles.length + formData.material_images.length;

//       if (totalImages > MAX_IMAGES) {
//         const allowedFiles = selectedFiles.slice(0, MAX_IMAGES - formData.material_images.length);
//         setFormData((prevData) => ({
//           ...prevData,
//           material_images: [...prevData.material_images, ...allowedFiles],
//         }));
//         toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
//       } else {
//         setFormData((prevData) => ({
//           ...prevData,
//           material_images: [...prevData.material_images, ...selectedFiles],
//         }));
//       }
//     }
//   };

//   // Function to remove a selected image
//   const handleRemoveImage = (index) => {
//     const updatedImages = [...formData.material_images];
//     updatedImages.splice(index, 1);
//     setFormData((prevData) => ({ ...prevData, material_images: updatedImages }));
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
//       'materialCategory',
//       'name',
//       'description',
//       'form',
//       'volume.amount',
//       'volume.unit',
//       'industrialStandards',
//       'purityLevel',
//       'quantity.amount',
//       'quantity.unit',
//       'price.amount',
//       'price.unit',
//       'currency',
//       'locationCountry',
//       'locationCity',
//     ];

//     let isValid = true;
//     requiredFields.forEach(field => {
//       const keys = field.split('.');
//       let value = formData;
//       keys.forEach(key => {
//         value = value[key];
//       });
//       if (
//         (Array.isArray(value) && value.length === 0) || // For arrays
//         (!Array.isArray(value) && !value && typeof value !== "number") // For other fields
//       ) {
//         isValid = false;
//         const fieldLabel = field.includes('.') ? field.split('.').join(' ') : field;
//         toast.error(`Please fill in the ${fieldLabel} field.`);
//       }
//     });

//     // If bulkDiscountsAvailable is true, ensure bulkDiscounts is filled
//     if (formData.bulkDiscountsAvailable && !formData.bulkDiscounts.trim()) {
//       isValid = false;
//       toast.error("Please provide details for bulk discounts.");
//     }

//     // Ensure at least one image is uploaded
//     if (formData.material_images.length === 0) {
//       isValid = false;
//       toast.error("Please upload at least one material image.");
//     }

//     if (!isValid) {
//       setLoading(false);
//       return;
//     }

//     const rawMaterialData = new FormData();
//     rawMaterialData.append("materialCategory", formData.materialCategory);
//     rawMaterialData.append("name", formData.name);
//     rawMaterialData.append("description", formData.description);
//     rawMaterialData.append("form", formData.form);
//     rawMaterialData.append("volume.amount", formData.volume.amount);
//     rawMaterialData.append("volume.unit", formData.volume.unit);
//     rawMaterialData.append("industrialStandards", formData.industrialStandards);
//     rawMaterialData.append("purityLevel", formData.purityLevel);
//     rawMaterialData.append("quantity.amount", formData.quantity.amount);
//     rawMaterialData.append("quantity.unit", formData.quantity.unit);
//     rawMaterialData.append("fixedPrice", formData.fixedPrice);
//     rawMaterialData.append("negotiablePrice", formData.negotiablePrice);
//     rawMaterialData.append("price.amount", formData.price.amount);
//     rawMaterialData.append("price.unit", formData.price.unit);
//     rawMaterialData.append("currency", formData.currency);
//     rawMaterialData.append("locationCountry", formData.locationCountry);
//     rawMaterialData.append("locationCity", formData.locationCity);
//     rawMaterialData.append("availability", formData.availability);
//     rawMaterialData.append("bulkDiscountsAvailable", formData.bulkDiscountsAvailable);
//     rawMaterialData.append("bulkDiscounts", formData.bulkDiscounts);

//     // Append images
//     formData.material_images.forEach((image, index) => {
//       rawMaterialData.append("material_images", image);
//     });

//     try {
//       // Replace the placeholder URL with your actual API endpoint
//       const apiUrl = "https://your-backend-api.com/api/raw-material-offering"; // Replace with your API URL

//       const response = await axios.post(apiUrl, rawMaterialData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.success) {
//         toast.success(response.data.message || "Raw Material registered successfully!");
//         navigate("/dashboard/raw-materials"); // Redirect to raw materials dashboard or desired page
//       } else {
//         toast.error(response.data.message || "Failed to register raw material.");
//       }
//     } catch (error) {
//       console.error(error);
//       if (error.response?.data?.error === "Invalid token") {
//         toast.error("Session expired or invalid. Please log in again.");
//         removeCookie('token'); // Remove the 'token' cookie
//         navigate("/login"); // Redirect to login page
//       } else {
//         toast.error(error.response?.data?.message || "Failed to register raw material.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-3xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <h2 className="text-2xl font-bold mb-6 text-orange">Register Raw Material</h2>
//       {fetchingFields ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="loader">
//             <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Material Category */}
//           <div>
//             <label htmlFor="materialCategory" className="block text-sm font-medium">
//               Material Category<span className="text-red-500">*</span>
//             </label>
//             <Select
//               id="materialCategory"
//               name="materialCategory"
//               options={categories.map(cat => ({ value: cat, label: cat }))}
//               value={categories
//                 .filter(cat => cat === formData.materialCategory)
//                 .map(cat => ({ value: cat, label: cat }))}
//               onChange={handleSelectChange}
//               className="w-full"
//               placeholder="Select Material Category"
//               isClearable
//               required
//             />
//           </div>

//           {/* Name */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium">
//               Name<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium">
//               Description<span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Form */}
//           <div>
//             <label htmlFor="form" className="block text-sm font-medium">
//               Form<span className="text-red-500">*</span>
//             </label>
//             <Select
//               id="form"
//               name="form"
//               options={formOptions}
//               value={formOptions.find(option => option.value === formData.form) || null}
//               onChange={handleSelectChange}
//               className="w-full"
//               placeholder="Select Form"
//               isClearable
//               required
//             />
//           </div>

//           {/* Volume */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Volume Amount */}
//             <div>
//               <label htmlFor="volume.amount" className="block text-sm font-medium">
//                 Volume Amount<span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="volume.amount"
//                 type="number"
//                 name="volume.amount"
//                 value={formData.volume.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Volume Unit */}
//             <div>
//               <label htmlFor="volume.unit" className="block text-sm font-medium">
//                 Volume Unit<span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="volume.unit"
//                 type="text"
//                 name="volume.unit"
//                 value={formData.volume.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="e.g., kg, liters"
//               />
//             </div>
//           </div>

//           {/* Industrial Standards */}
//           <div>
//             <label htmlFor="industrialStandards" className="block text-sm font-medium">
//               Industrial Standards<span className="text-red-500">*</span>
//             </label>
//             <Select
//               id="industrialStandards"
//               name="industrialStandards"
//               options={standards.map(std => ({ value: std, label: std }))}
//               value={standards
//                 .filter(std => std === formData.industrialStandards)
//                 .map(std => ({ value: std, label: std }))}
//               onChange={handleSelectChange}
//               className="w-full"
//               placeholder="Select Industrial Standards"
//               isClearable
//               required
//             />
//           </div>

//           {/* Purity Level */}
//           <div>
//             <label htmlFor="purityLevel" className="block text-sm font-medium">
//               Purity Level<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="purityLevel"
//               type="number"
//               name="purityLevel"
//               value={formData.purityLevel}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//               min="0"
//               max="100"
//               step="0.1"
//               placeholder="e.g., 99.9"
//             />
//           </div>

//           {/* Quantity */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Quantity Amount */}
//             <div>
//               <label htmlFor="quantity.amount" className="block text-sm font-medium">
//                 Quantity Amount<span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="quantity.amount"
//                 type="number"
//                 name="quantity.amount"
//                 value={formData.quantity.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Quantity Unit */}
//             <div>
//               <label htmlFor="quantity.unit" className="block text-sm font-medium">
//                 Quantity Unit<span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="quantity.unit"
//                 type="text"
//                 name="quantity.unit"
//                 value={formData.quantity.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="e.g., kg, pieces"
//               />
//             </div>
//           </div>

//           {/* Pricing Options */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Fixed Price */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="fixedPrice"
//                 checked={formData.fixedPrice}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-orange border-gray-300 rounded"
//               />
//               <label htmlFor="fixedPrice" className="ml-2 block text-sm font-medium">
//                 Fixed Price
//               </label>
//             </div>

//             {/* Negotiable Price */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="negotiablePrice"
//                 checked={formData.negotiablePrice}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-orange border-gray-300 rounded"
//               />
//               <label htmlFor="negotiablePrice" className="ml-2 block text-sm font-medium">
//                 Negotiable Price
//               </label>
//             </div>
//           </div>

//           {/* Price */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Price Amount */}
//             <div>
//               <label htmlFor="price.amount" className="block text-sm font-medium">
//                 Price Amount<span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="price.amount"
//                 type="number"
//                 name="price.amount"
//                 value={formData.price.amount}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>

//             {/* Price Unit */}
//             <div>
//               <label htmlFor="price.unit" className="block text-sm font-medium">
//                 Price Unit<span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="price.unit"
//                 type="text"
//                 name="price.unit"
//                 value={formData.price.unit}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 required
//                 placeholder="e.g., USD, EUR"
//               />
//             </div>
//           </div>

//           {/* Currency */}
//           <div>
//             <label htmlFor="currency" className="block text-sm font-medium">
//               Currency<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="currency"
//               type="text"
//               name="currency"
//               value={formData.currency}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//               placeholder="DZD"
//             />
//           </div>

//           {/* Location Country */}
//           <div>
//             <label htmlFor="locationCountry" className="block text-sm font-medium">
//               Location Country<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="locationCountry"
//               type="text"
//               name="locationCountry"
//               value={formData.locationCountry}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Location City */}
//           <div>
//             <label htmlFor="locationCity" className="block text-sm font-medium">
//               Location City<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="locationCity"
//               type="text"
//               name="locationCity"
//               value={formData.locationCity}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Availability */}
//           <div>
//             <label htmlFor="availability" className="block text-sm font-medium">
//               Availability
//             </label>
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

//           {/* Bulk Discounts Available */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="bulkDiscountsAvailable"
//               checked={formData.bulkDiscountsAvailable}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-orange border-gray-300 rounded"
//               required
//             />
//             <label htmlFor="bulkDiscountsAvailable" className="ml-2 block text-sm font-medium">
//               Bulk Discounts Available<span className="text-red-500">*</span>
//             </label>
//           </div>

//           {/* Bulk Discounts (Conditional) */}
//           {formData.bulkDiscountsAvailable && (
//             <div>
//               <label htmlFor="bulkDiscounts" className="block text-sm font-medium">
//                 Bulk Discounts
//               </label>
//               <textarea
//                 id="bulkDiscounts"
//                 name="bulkDiscounts"
//                 value={formData.bulkDiscounts}
//                 onChange={handleInputChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Describe your bulk discount options here..."
//                 required={formData.bulkDiscountsAvailable}
//               />
//             </div>
//           )}

//           {/* Material Images */}
//           <div>
//             <label htmlFor="material_images" className="block text-sm font-medium">
//               Material Images<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="material_images"
//               type="file"
//               name="material_images"
//               multiple
//               onChange={handleFileChange}
//               className="w-full border rounded px-3 py-2"
//               accept="image/*"
//             />
//             {/* Display current number of uploaded images */}
//             <p className="text-sm text-gray-500">
//               {formData.material_images.length} / {MAX_IMAGES} images uploaded.
//             </p>
//             {/* Image Previews with Remove Option */}
//             <div className="flex flex-wrap mt-2">
//               {formData.material_images.map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt={`Preview ${index}`}
//                     className="w-24 h-24 object-cover mr-2 mb-2 rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(index)}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 focus:outline-none"
//                     title="Remove Image"
//                   >
//                     &times;
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
//             disabled={loading || formData.material_images.length === 0} // Disable if loading or no images
//           >
//             {loading ? "Registering..." : "Register Raw Material"}
//           </button>
//         </form>
//       )}
//     </motion.div>
//   );
// };

// export default RawMaterialOffering;






// RawMaterialOffering.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Oval } from "react-loader-spinner";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchDynamicFields } from "../../../../slices/dynamicFieldsSlice"; // Adjust the path accordingly

// Define options for enums
const formOptions = [
  { value: "Tubes", label: "Tubes" },
  { value: "Bars", label: "Bars" },
  { value: "Sheets", label: "Sheets" },
  { value: "Plates", label: "Plates" },
  { value: "Wires", label: "Wires" },
  { value: "Coils", label: "Coils" },
  { value: "Pellets", label: "Pellets" },
  { value: "Granules", label: "Granules" },
  { value: "Rods", label: "Rods" },
  { value: "Films", label: "Films" },
  { value: "Foams", label: "Foams" },
  { value: "Logs", label: "Logs" },
  { value: "Planks", label: "Planks" },
  { value: "Boards", label: "Boards" },
  { value: "Veneers", label: "Veneers" },
  { value: "Chips", label: "Chips" },
  { value: "Sawdust", label: "Sawdust" },
  { value: "Powders", label: "Powders" },
  { value: "Fabrics", label: "Fabrics" },
  { value: "Yarns", label: "Yarns" },
  { value: "Threads", label: "Threads" },
  { value: "Liquids", label: "Liquids" },
  { value: "Ores", label: "Ores" },
  { value: "Aggregates", label: "Aggregates" },
  { value: "Bricks", label: "Bricks" },
  { value: "Blocks", label: "Blocks" },
  { value: "Cement", label: "Cement" },
  { value: "Concrete", label: "Concrete" },
];

const availabilityOptions = [
  { value: "In Stock", label: "In Stock" },
  { value: "Available on Order", label: "Available on Order" },
];

const baseURL = "https://industradz-backend-new.onrender.com";


const RawMaterialOffering = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [formData, setFormData] = useState({
    materialCategory: "",
    name: "",
    description: "",
    form: "",
    volume: {
      amount: "",
      unit: "",
    },
    industrialStandards: "",
    purityLevel: "",
    quantity: {
      amount: "",
      unit: "",
    },
    fixedPrice: true,
    negotiablePrice: false,
    price: {
      amount: "",
      unit: "",
    },
    currency: "DZD",
    material_images: [],
    locationCountry: "",
    locationCity: "",
    availability: "In Stock",
    bulkDiscountsAvailable: false,
    bulkDiscounts: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Access dynamic fields from Redux
  const categories = useSelector((state) => state.dynamicFields.data.rawMaterialCategory) || [];
  const standards = useSelector((state) => state.dynamicFields.data.certifications) || [];
  const dynamicFieldsLoading = useSelector((state) => state.dynamicFields.loading);
  const dynamicFieldsError = useSelector((state) => state.dynamicFields.error);

  // Dispatch fetchDynamicFields on component mount
  useEffect(() => {
    if (!categories.length || !standards.length) { // Fetch only if not already fetched
      dispatch(fetchDynamicFields());
    }
  }, [dispatch, categories.length, standards.length]);

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

  // Handle Select dropdown changes for single select fields
  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prevData) => ({ ...prevData, [name]: selectedOption ? selectedOption.value : "" }));
  };

  // Handle file input with image limit
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const totalImages = selectedFiles.length + formData.material_images.length;

      if (totalImages > 5) { // MAX_IMAGES = 5
        const allowedFiles = selectedFiles.slice(0, 5 - formData.material_images.length);
        setFormData((prevData) => ({
          ...prevData,
          material_images: [...prevData.material_images, ...allowedFiles],
        }));
        toast.error(`You can only upload a maximum of 5 images.`);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          material_images: [...prevData.material_images, ...selectedFiles],
        }));
      }
    }
  };

  // Function to remove a selected image
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.material_images];
    updatedImages.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, material_images: updatedImages }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = cookies.token; // Retrieve token from cookies

    if (!token) {
      toast.error("You are not logged in. Please log in first.");
      setLoading(false);
      navigate("/login"); // Redirect to login page
      return;
    }

    // Validate required fields
    const requiredFields = [
      'materialCategory',
      'name',
      'description',
      'form',
      'volume.amount',
      'volume.unit',
      'industrialStandards',
      'purityLevel',
      'quantity.amount',
      'quantity.unit',
      'price.amount',
      'price.unit',
      'currency',
      'locationCountry',
      'locationCity',
    ];

    let isValid = true;
    requiredFields.forEach(field => {
      const keys = field.split('.');
      let value = formData;
      keys.forEach(key => {
        value = value[key];
      });
      if (
        (Array.isArray(value) && value.length === 0) || // For arrays
        (!Array.isArray(value) && !value && typeof value !== "number") // For other fields
      ) {
        isValid = false;
        const fieldLabel = field.includes('.') ? field.split('.').join(' ') : field;
        toast.error(`Please fill in the ${fieldLabel} field.`);
      }
    });

    // If bulkDiscountsAvailable is true, ensure bulkDiscounts is filled
    if (formData.bulkDiscountsAvailable && !formData.bulkDiscounts.trim()) {
      isValid = false;
      toast.error("Please provide details for bulk discounts.");
    }

    // Ensure at least one image is uploaded
    if (formData.material_images.length === 0) {
      isValid = false;
      toast.error("Please upload at least one material image.");
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const rawMaterialData = new FormData();
    rawMaterialData.append("materialCategory", formData.materialCategory);
    rawMaterialData.append("name", formData.name);
    rawMaterialData.append("description", formData.description);
    rawMaterialData.append("form", formData.form);
    rawMaterialData.append("volume.amount", formData.volume.amount);
    rawMaterialData.append("volume.unit", formData.volume.unit);
    rawMaterialData.append("industrialStandards", formData.industrialStandards);
    rawMaterialData.append("purityLevel", formData.purityLevel);
    rawMaterialData.append("quantity.amount", formData.quantity.amount);
    rawMaterialData.append("quantity.unit", formData.quantity.unit);
    rawMaterialData.append("fixedPrice", formData.fixedPrice);
    rawMaterialData.append("negotiablePrice", formData.negotiablePrice);
    rawMaterialData.append("price.amount", formData.price.amount);
    rawMaterialData.append("price.unit", formData.price.unit);
    rawMaterialData.append("currency", formData.currency);
    rawMaterialData.append("locationCountry", formData.locationCountry);
    rawMaterialData.append("locationCity", formData.locationCity);
    rawMaterialData.append("availability", formData.availability);
    rawMaterialData.append("bulkDiscountsAvailable", formData.bulkDiscountsAvailable);
    rawMaterialData.append("bulkDiscounts", formData.bulkDiscounts);

    // Append images
    formData.material_images.forEach((image, index) => {
      rawMaterialData.append("material_images", image);
    });

    try {
      // Replace the placeholder URL with your actual API endpoint
      const apiUrl = `${baseURL}/api/raw-material`; // Replace with your API URL

      const response = await axios.post(apiUrl, rawMaterialData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Raw Material registered successfully!");
        navigate("/dashboard/services/marketplace/raw-material"); // Redirect to raw materials dashboard or desired page
      } else {
        toast.error(response.data.message || "Failed to register raw material.");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error === "Invalid token") {
        toast.error("Session expired or invalid. Please log in again.");
        removeCookie('token'); // Remove the 'token' cookie
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(error.response?.data?.message || "Failed to register raw material.");
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
      <h2 className="text-2xl font-bold mb-6 text-orange">Register Raw Material</h2>
      {dynamicFieldsLoading ? (
        <div className="flex justify-center items-center h-64">
          <Oval
            height={50}
            width={50}
            color="#4F46E5" // Primary color
            ariaLabel="Loading dynamic fields"
            secondaryColor="#c0c0c0" // Secondary color
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : dynamicFieldsError ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{dynamicFieldsError}</p>
          <button
            onClick={() => dispatch(fetchDynamicFields())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Material Category */}
          <div>
            <label htmlFor="materialCategory" className="block text-sm font-medium">
              Material Category<span className="text-red-500">*</span>
            </label>
            <Select
              id="materialCategory"
              name="materialCategory"
              options={categories.map(cat => ({ value: cat, label: cat }))}
              value={categories
                .filter(cat => cat === formData.materialCategory)
                .map(cat => ({ value: cat, label: cat }))}
              onChange={handleSelectChange}
              className="w-full"
              placeholder="Select Material Category"
              isClearable
              required
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Form */}
          <div>
            <label htmlFor="form" className="block text-sm font-medium">
              Form<span className="text-red-500">*</span>
            </label>
            <Select
              id="form"
              name="form"
              options={formOptions}
              value={formOptions.find(option => option.value === formData.form) || null}
              onChange={handleSelectChange}
              className="w-full"
              placeholder="Select Form"
              isClearable
              required
            />
          </div>

          {/* Volume */}
          <div className="grid grid-cols-2 gap-6">
            {/* Volume Amount */}
            <div>
              <label htmlFor="volume.amount" className="block text-sm font-medium">
                Volume Amount<span className="text-red-500">*</span>
              </label>
              <input
                id="volume.amount"
                type="number"
                name="volume.amount"
                value={formData.volume.amount}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Volume Unit */}
            <div>
              <label htmlFor="volume.unit" className="block text-sm font-medium">
                Volume Unit<span className="text-red-500">*</span>
              </label>
              <input
                id="volume.unit"
                type="text"
                name="volume.unit"
                value={formData.volume.unit}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                placeholder="e.g., kg, liters"
              />
            </div>
          </div>

          {/* Industrial Standards */}
          <div>
            <label htmlFor="industrialStandards" className="block text-sm font-medium">
              Industrial Standards<span className="text-red-500">*</span>
            </label>
            <Select
              id="industrialStandards"
              name="industrialStandards"
              options={standards.map(std => ({ value: std, label: std }))}
              value={standards
                .filter(std => std === formData.industrialStandards)
                .map(std => ({ value: std, label: std }))}
              onChange={handleSelectChange}
              className="w-full"
              placeholder="Select Industrial Standards"
              isClearable
              required
            />
          </div>

          {/* Purity Level */}
          <div>
            <label htmlFor="purityLevel" className="block text-sm font-medium">
              Purity Level<span className="text-red-500">*</span>
            </label>
            <input
              id="purityLevel"
              type="number"
              name="purityLevel"
              value={formData.purityLevel}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 99.9"
            />
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quantity Amount */}
            <div>
              <label htmlFor="quantity.amount" className="block text-sm font-medium">
                Quantity Amount<span className="text-red-500">*</span>
              </label>
              <input
                id="quantity.amount"
                type="number"
                name="quantity.amount"
                value={formData.quantity.amount}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Quantity Unit */}
            <div>
              <label htmlFor="quantity.unit" className="block text-sm font-medium">
                Quantity Unit<span className="text-red-500">*</span>
              </label>
              <input
                id="quantity.unit"
                type="text"
                name="quantity.unit"
                value={formData.quantity.unit}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                placeholder="e.g., kg, pieces"
              />
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-2 gap-6">
            {/* Fixed Price */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="fixedPrice"
                checked={formData.fixedPrice}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange border-gray-300 rounded"
              />
              <label htmlFor="fixedPrice" className="ml-2 block text-sm font-medium">
                Fixed Price
              </label>
            </div>

            {/* Negotiable Price */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="negotiablePrice"
                checked={formData.negotiablePrice}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange border-gray-300 rounded"
              />
              <label htmlFor="negotiablePrice" className="ml-2 block text-sm font-medium">
                Negotiable Price
              </label>
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-6">
            {/* Price Amount */}
            <div>
              <label htmlFor="price.amount" className="block text-sm font-medium">
                Price Amount<span className="text-red-500">*</span>
              </label>
              <input
                id="price.amount"
                type="number"
                name="price.amount"
                value={formData.price.amount}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Price Unit */}
            <div>
              <label htmlFor="price.unit" className="block text-sm font-medium">
                Price Unit<span className="text-red-500">*</span>
              </label>
              <input
                id="price.unit"
                type="text"
                name="price.unit"
                value={formData.price.unit}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                placeholder="e.g., USD, EUR"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium">
              Currency<span className="text-red-500">*</span>
            </label>
            <input
              id="currency"
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
              placeholder="DZD"
            />
          </div>

          {/* Location Country */}
          <div>
            <label htmlFor="locationCountry" className="block text-sm font-medium">
              Location Country<span className="text-red-500">*</span>
            </label>
            <input
              id="locationCountry"
              type="text"
              name="locationCountry"
              value={formData.locationCountry}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Location City */}
          <div>
            <label htmlFor="locationCity" className="block text-sm font-medium">
              Location City<span className="text-red-500">*</span>
            </label>
            <input
              id="locationCity"
              type="text"
              name="locationCity"
              value={formData.locationCity}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium">
              Availability
            </label>
            <Select
              id="availability"
              name="availability"
              options={availabilityOptions}
              value={availabilityOptions.find(option => option.value === formData.availability) || null}
              onChange={handleSelectChange}
              className="w-full"
              placeholder="Select Availability"
              isClearable
            />
          </div>

          {/* Bulk Discounts Available */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="bulkDiscountsAvailable"
              checked={formData.bulkDiscountsAvailable}
              onChange={handleInputChange}
              className="h-4 w-4 text-orange border-gray-300 rounded"
              required
            />
            <label htmlFor="bulkDiscountsAvailable" className="ml-2 block text-sm font-medium">
              Bulk Discounts Available<span className="text-red-500">*</span>
            </label>
          </div>

          {/* Bulk Discounts (Conditional) */}
          {formData.bulkDiscountsAvailable && (
            <div>
              <label htmlFor="bulkDiscounts" className="block text-sm font-medium">
                Bulk Discounts
              </label>
              <textarea
                id="bulkDiscounts"
                name="bulkDiscounts"
                value={formData.bulkDiscounts}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Describe your bulk discount options here..."
                required={formData.bulkDiscountsAvailable}
              />
            </div>
          )}

          {/* Material Images */}
          <div>
            <label htmlFor="material_images" className="block text-sm font-medium">
              Material Images<span className="text-red-500">*</span>
            </label>
            <input
              id="material_images"
              type="file"
              name="material_images"
              multiple
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
              accept="image/*"
            />
            {/* Display current number of uploaded images */}
            <p className="text-sm text-gray-500">
              {formData.material_images.length} / 5 images uploaded.
            </p>
            {/* Image Previews with Remove Option */}
            <div className="flex flex-wrap mt-2">
              {formData.material_images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover mr-2 mb-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-gray-100 text-gray-500 rounded-full p-1 focus:outline-none"
                    title="Remove Image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
            // disabled={loading || formData.material_images.length === 0}
          >
            {loading ? "Registering..." : "Register Raw Material"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RawMaterialOffering;
