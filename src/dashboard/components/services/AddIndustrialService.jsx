// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const AddIndustrialService = () => {
//     const router = useNavigate();
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",

//         pricingAmount: "",
//         pricingUnit: "",
//         pricingType: "",

//         images: [],

//     });

//     const [loading, setLoading] = useState(false); // New loading state

//     // const categories = [
//     //     "Industrial Offerings",
//     //     "Industrial Machines",
//     //     "Spare Parts",
//     //     "Raw Materials",
//     // ];

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     // Handle dropdown changes
//     const handleDropdownChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     // Handle file input
//     const handleFileChange = (e) => {
//         const files = e.target.files;
//         if (files) {
//             setFormData((prevData) => ({ ...prevData, images: Array.from(files) }));
//         }
//     };

//     // Handle coordinates input
//     const handleCoordinateChange = (index, value) => {
//         const updatedCoordinates = [...formData.coordinates];
//         updatedCoordinates[index] = value;
//         setFormData((prevData) => ({ ...prevData, coordinates: updatedCoordinates }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); // Start loading

//         const token = localStorage.getItem("token");

//         if (!token) {
//             toast.error("You are not logged in. Please log in first.");
//             setLoading(false); // Stop loading
//             return;
//         }

//         const serviceData = new FormData();
//         serviceData.append("title", formData.title);
//         serviceData.append("description", formData.description);
//         serviceData.append("pricing[amount]", formData.pricingAmount);
//         serviceData.append("pricing[unit]", formData.pricingUnit);
//         serviceData.append("pricingType", formData.pricingType);


//         // Attach images
//         formData.images.forEach((image) => serviceData.append("images", image));

//         try {
//             const response = await axios.post(
//                 "https://industradz-backend-new.onrender.com/api/service",
//                 serviceData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             toast.success(response.data.message || "Service added successfully!");
//             router.push("/dashboard/services");
//         } catch (error) {
//             console.error(error);
//             toast.error(error.response?.data?.message || "Failed to add service.");
//         } finally {
//             setLoading(false); // Stop loading after request completion
//         }
//     };

//     return (
//         <motion.div className="max-w-2xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}>
//             <h2 className="text-xl font-bold mb-4 text-orange">Add Service</h2>
//             {loading ? (
//                 <div className="flex justify-center items-center h-screen">
//                     <div className="loader">
//                         <div className="justify-content-center jimu-primary-loading"></div>
//                     </div>
//                 </div>
//             ) : (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Title Input */}
//                     <div>
//                         <label className="block text-sm font-medium">Title</label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={formData.title}
//                             onChange={handleInputChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     {/* Description Input */}
//                     <div>
//                         <label className="block text-sm font-medium">Description</label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleInputChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     {/* Coordinates Input */}
//                     {/* <div className="flex gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">Latitude</label>
//                             <input
//                                 type="text"
//                                 value={formData.coordinates[0]}
//                                 onChange={(e) => handleCoordinateChange(0, e.target.value)}
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Longitude</label>
//                             <input
//                                 type="text"
//                                 value={formData.coordinates[1]}
//                                 onChange={(e) => handleCoordinateChange(1, e.target.value)}
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                         </div>
//                     </div> */}

//                     {/* Category Dropdown */}
//                     {/* <div>
//                         <label className="block text-sm font-medium">Category</label>
//                         <select
//                             name="category"
//                             value={formData.category}
//                             onChange={handleDropdownChange}
//                             className="w-full border rounded px-3 py-2"
//                         >
//                             {categories.map((category) => (
//                                 <option key={category} value={category}>
//                                     {category}
//                                 </option>
//                             ))}
//                         </select>
//                     </div> */}

//                     {/* Pricing Amount Input */}
//                     <div>
//                         <label className="block text-sm font-medium">Pricing Amount</label>
//                         <input
//                             type="number"
//                             name="pricingAmount"
//                             value={formData.pricingAmount}
//                             onChange={handleInputChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     {/* Pricing Unit Input */}
//                     <div>
//                         <label className="block text-sm font-medium">Pricing Unit</label>
//                         <input
//                             type="text"
//                             name="pricingUnit"
//                             value={formData.pricingUnit}
//                             onChange={handleInputChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Pricing Type Input */}
//                     <div>
//                         <label className="block text-sm font-medium">Pricing Type</label>
//                         <input
//                             type="text"
//                             name="pricingType"
//                             value={formData.pricingType}
//                             onChange={handleInputChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Availability Input */}
//                     {/* <div>
//                         <label className="block text-sm font-medium">Availability</label>
//                         <input
//                             type="text"
//                             name="availability"
//                             value={formData.availability}
//                             onChange={handleInputChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div> */}

//                     {/* Images Input */}
//                     <div>
//                         <label className="block text-sm font-medium">Images</label>
//                         <input
//                             type="file"
//                             multiple
//                             onChange={handleFileChange}
//                             className="w-full"
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
//                     >
//                         Register Service
//                     </button>
//                 </form>
//             )}
//         </motion.div>
//     );
// };

// export default AddIndustrialService;

















// src/components/services/AddIndustrialService.jsx

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import { useCookies } from "react-cookie"; // Import useCookies

// Define working days options
const daysOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
];

// Define currency options
const currencyOptions = [
    { value: "EUR", label: "Euro (EUR)" },
    { value: "DZD", label: "Algerian Dinar (DZD)" },
];

const AddIndustrialService = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        pricing: {
            amount: "",
            unit: "",
        },
        pricingType: "",
        images: [],
        workingHours: {
            days: "",
            startTime: "",
            endTime: "",
        },
    });

    const [categories] = useState([
        "Industrial Offerings",
        "Industrial Machines",
        "Spare Parts",
        "Raw Materials",
    ]);

    const [pricingTypes] = useState([
        "Fixed Price",
        "Hourly Rate",
        "Project Based",
    ]);
    const [loading, setLoading] = useState(false);

    // Handle input changes, including nested fields using dot notation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");

        if (keys.length === 1) {
            // Top-level field
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        } else if (keys.length === 2) {
            // Nested field (e.g., pricing.amount)
            const [parent, child] = keys;
            setFormData((prevData) => ({
                ...prevData,
                [parent]: { ...prevData[parent], [child]: value },
            }));
        }
    };

    // Handle dropdown changes for non-multi-select fields
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle file input
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            setFormData((prevData) => ({ ...prevData, images: Array.from(files) }));
        }
    };

    // Handle working days selection (multi-select)
    const handleWorkingDaysChange = (selectedOptions) => {
        const selectedDays = selectedOptions
            ? selectedOptions.map((option) => option.value)
            : [];
        setFormData((prevData) => ({
            ...prevData,
            workingHours: { ...prevData.workingHours, days: selectedDays.join("-") },
        }));
    };

    // Handle time changes for working hours
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            workingHours: { ...prevData.workingHours, [name]: value },
        }));
    };

    // Handle currency dropdown change
    const handleCurrencyChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            pricing: { ...prevData.pricing, unit: selectedOption ? selectedOption.value : "" },
        }));
    };

    // Function to convert time to 12-hour format
    const convertTo12HourFormat = (time24) => {
        const [hour, minute] = time24.split(":");
        let hour12 = parseInt(hour, 10);
        const ampm = hour12 >= 12 ? "PM" : "AM";
        hour12 = hour12 % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
    };

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
        if (
            !formData.title ||
            !formData.description ||
            !formData.category ||
            !formData.pricing.amount ||
            !formData.pricing.unit
        ) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // Construct the payload to match the schema
        const payload = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            pricing: {
                amount: Number(formData.pricing.amount), // Convert to number
                unit: formData.pricing.unit, // Keep as string
            },
            pricingType: formData.pricingType,
            workingHours: {
                days: formData.workingHours.days, // Comma-separated string
                startTime: Number(formData.workingHours.startTime), // Convert to number
                endTime: Number(formData.workingHours.endTime), // Convert to number
            },
            images: [], // Will be handled below
        };

        // Attach image URLs or file uploads
        if (formData.images.length > 0) {
            payload.images = formData.images.map((file) => {
                if (typeof file === "string") {
                    return file; // Already a URL
                }
                return URL.createObjectURL(file); // Convert file to URL for testing
            });
        }
        console.log("Payload being sent:", payload);

        try {
            const response = await axios.post(
                "https://industradz-backend-new.onrender.com/api/service",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(response.data.message || "Service added successfully!");
            navigate("/dashboard/services/industrials-offering");
        } catch (error) {
            console.error(error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to add service. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <motion.div
            className="max-w-2xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-xl font-bold mb-4 text-orange">Add Service</h2>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="loader">
                        <div className="justify-content-center jimu-primary-loading"></div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                            rows="4"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleDropdownChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pricing Amount Input */}
                    <div>
                        <label htmlFor="pricing.amount" className="block text-sm font-medium">
                            Pricing Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="pricing.amount"
                            type="number"
                            name="pricing.amount" // Use dot notation for nested field
                            value={formData.pricing.amount}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Pricing Unit Dropdown */}
                    <div>
                        <label htmlFor="pricing.unit" className="block text-sm font-medium">
                            Pricing Unit <span className="text-red-500">*</span>
                        </label>
                        <Select
                            id="pricing.unit"
                            name="pricing.unit"
                            options={currencyOptions}
                            value={
                                currencyOptions.find(
                                    (option) => option.value === formData.pricing.unit
                                ) || null
                            }
                            onChange={handleCurrencyChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Select Currency Unit"
                            isClearable
                            required
                        />
                    </div>

                    {/* Pricing Type Dropdown */}
                    <div>
                        <label htmlFor="pricingType" className="block text-sm font-medium">
                            Pricing Type
                        </label>
                        <select
                            id="pricingType"
                            name="pricingType"
                            value={formData.pricingType}
                            onChange={handleDropdownChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Select Pricing Type</option>
                            {pricingTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Working Hours */}
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2 font-semibold">
                            Working Hours
                        </label>

                        {/* Select Working Days */}
                        <div className="mb-4">
                            {/* Working Days Selection */}
                            <label className="block text-gray-600 mb-2">Select Working Days</label>
                            <Select
                                isMulti
                                name="working_days"
                                options={daysOptions}
                                value={daysOptions.filter((option) =>
                                    formData.workingHours.days.split(",").includes(option.value)
                                )}
                                onChange={(selectedOptions) => {
                                    const days = selectedOptions.map((opt) => opt.value).join(",");
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        workingHours: { ...prevData.workingHours, days },
                                    }));
                                }}
                                className="w-full"
                                placeholder="Select days"
                            />

                            {/* Start Time */}
                            <label htmlFor="startTime" className="block text-gray-600 mt-2">
                                Start Time
                            </label>
                            <input
                                id="startTime"
                                type="number"
                                name="startTime"
                                value={formData.workingHours.startTime}
                                onChange={(e) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        workingHours: {
                                            ...prevData.workingHours,
                                            startTime: e.target.value,
                                        },
                                    }));
                                }}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="e.g., 9 for 9 AM"
                            />

                            {/* End Time */}
                            <label htmlFor="endTime" className="block text-gray-600 mt-2">
                                End Time
                            </label>
                            <input
                                id="endTime"
                                type="number"
                                name="endTime"
                                value={formData.workingHours.endTime}
                                onChange={(e) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        workingHours: {
                                            ...prevData.workingHours,
                                            endTime: e.target.value,
                                        },
                                    }));
                                }}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="e.g., 17 for 5 PM"
                            />
                        </div>

                    </div>

                    {/* Images Input */}
                    <div>
                        <label className="block text-sm font-medium">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full"
                            accept="image/*"
                        />
                        {/* Optional: Image Previews */}
                        <div className="flex flex-wrap mt-2">
                            {formData.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${index}`}
                                    className="w-24 h-24 object-cover mr-2 mb-2 rounded"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
                        disabled={loading} // Disable button during loading
                    >
                        {loading ? "Registering..." : "Register Service"}
                    </button>
                </form>
            )}
        </motion.div>
    );
};

export default AddIndustrialService;
