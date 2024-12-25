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




















import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import { useCookies } from "react-cookie"; // Import useCookies

const daysOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
];

const AddIndustrialService = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']); // Destructure removeCookie
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        pricing: { // Nested pricing object
            amount: "",
            unit: "",
        },
        pricingType: "",
        images: [],
        workingHours: {
            working_days: [],
            working_start_time: "",
            working_end_time: "",
        },
    });

    const [categories] = useState([
        "Industrial Offerings",
        "Industrial Machines",
        "Spare Parts",
        "Raw Materials",
    ]);

    const [pricingTypes] = useState(["Fixed Price", "Hourly Rate", "Project Based"]);
    const [loading, setLoading] = useState(false);

    // Optional: Fetch businesses if needed
    // useEffect(() => {
    //     // Fetch businesses here if the backend requires it
    // }, []);

    // Handle input changes, including nested fields using dot notation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

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
    const handleWorkingHoursChange = (selectedOptions) => {
        const selectedDays = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData((prevData) => ({
            ...prevData,
            workingHours: { ...prevData.workingHours, working_days: selectedDays },
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

    // Function to convert time to 12-hour format
    const convertTo12HourFormat = (time24) => {
        const [hour, minute] = time24.split(":");
        let hour12 = parseInt(hour, 10);
        const ampm = hour12 >= 12 ? "PM" : "AM";
        hour12 = hour12 % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
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
        if (
            !formData.title ||
            !formData.description ||
            !formData.category ||
            !formData.pricing.amount || // Updated to nested field
            !formData.pricing.unit // Updated to nested field
        ) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const serviceData = new FormData();
        serviceData.append("title", formData.title);
        serviceData.append("description", formData.description);
        serviceData.append("category", formData.category);
        serviceData.append("pricing.amount", formData.pricing.amount);
        serviceData.append("pricing.unit", formData.pricing.unit);
        serviceData.append("pricingType", formData.pricingType);

        // Construct workingHours.days and workingHours.time
        const { working_days, working_start_time, working_end_time } = formData.workingHours;
        let workingDaysString = "";
        let workingTimeString = "";

        if (working_days.length > 0) {
            workingDaysString = working_days.join("-");
            serviceData.append("workingHours.days", workingDaysString);
        }

        if (working_start_time && working_end_time) {
            workingTimeString = `${convertTo12HourFormat(working_start_time)} - ${convertTo12HourFormat(working_end_time)}`;
            serviceData.append("workingHours.time", workingTimeString);
        }

        // Optionally, add validation to ensure both days and time are provided together
        if (working_days.length > 0 && (!working_start_time || !working_end_time)) {
            toast.error("Please provide both start and end times for working hours.");
            setLoading(false);
            return;
        }

        // Attach images
        formData.images.forEach((image) => serviceData.append("images", image));

        try {
            const response = await axios.post(
                "https://industradz-backend-new.onrender.com/api/service",
                serviceData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success(response.data.message || "Service added successfully!");
            navigate("/dashboard/services");
        } catch (error) {
            console.error(error);
            if (error.response?.data?.error === "Invalid token") {
                toast.error("Session expired or invalid. Please log in again.");
                removeCookie('token'); // Correctly remove the 'token' cookie
                navigate("/login"); // Redirect to login page
            } else {
                toast.error(error.response?.data?.message || "Failed to add service.");
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
                        <label htmlFor="title" className="block text-sm font-medium">Title</label>
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
                        <label htmlFor="description" className="block text-sm font-medium">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium">Category</label>
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
                        <label htmlFor="pricing.amount" className="block text-sm font-medium">Pricing Amount</label>
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

                    {/* Pricing Unit Input */}
                    <div>
                        <label htmlFor="pricing.unit" className="block text-sm font-medium">Pricing Unit</label>
                        <input
                            id="pricing.unit"
                            type="text"
                            name="pricing.unit" // Use dot notation for nested field
                            value={formData.pricing.unit}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Pricing Type Dropdown */}
                    <div>
                        <label htmlFor="pricingType" className="block text-sm font-medium">Pricing Type</label>
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
                            <label className="block text-gray-600 mb-2">
                                Select Working Days
                            </label>
                            <Select
                                isMulti
                                name="working_days"
                                options={daysOptions}
                                value={formData.workingHours.working_days?.map((day) => ({
                                    value: day,
                                    label: day,
                                }))}
                                onChange={handleWorkingHoursChange}
                                className="w-full"
                                placeholder="Select days"
                            />
                        </div>

                        {/* Input Working Hours */}
                        <div className="flex space-x-4">
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="working_start_time" className="block text-sm font-medium">Start Time</label>
                                <input
                                    id="working_start_time"
                                    type="time"
                                    name="working_start_time"
                                    value={formData.workingHours.working_start_time || ""}
                                    onChange={handleTimeChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required={formData.workingHours.working_days.length > 0}
                                />
                            </div>
                            <div className="flex items-center">
                                <span>to</span>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label htmlFor="working_end_time" className="block text-sm font-medium">End Time</label>
                                <input
                                    id="working_end_time"
                                    type="time"
                                    name="working_end_time"
                                    value={formData.workingHours.working_end_time || ""}
                                    onChange={handleTimeChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required={formData.workingHours.working_days.length > 0}
                                />
                            </div>
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
                                    className="w-24 h-24 object-cover mr-2 mb-2"
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
