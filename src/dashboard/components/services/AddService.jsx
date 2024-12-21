import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddService = () => {
    const router = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Industrial Offerings",
        pricingAmount: "",
        pricingUnit: "",
        pricingType: "",
        availability: "",
        images: [],
        locationType: "Point",
        coordinates: ["", ""], // [latitude, longitude]
    });

    const [loading, setLoading] = useState(false); // New loading state

    const categories = [
        "Industrial Offerings",
        "Industrial Machines",
        "Spare Parts",
        "Raw Materials",
    ];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle dropdown changes
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

    // Handle coordinates input
    const handleCoordinateChange = (index, value) => {
        const updatedCoordinates = [...formData.coordinates];
        updatedCoordinates[index] = value;
        setFormData((prevData) => ({ ...prevData, coordinates: updatedCoordinates }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in. Please log in first.");
            setLoading(false); // Stop loading
            return;
        }

        const serviceData = new FormData();
        serviceData.append("title", formData.title);
        serviceData.append("description", formData.description);
        serviceData.append("category", formData.category);
        serviceData.append("pricing[amount]", formData.pricingAmount);
        serviceData.append("pricing[unit]", formData.pricingUnit);
        serviceData.append("pricingType", formData.pricingType);
        serviceData.append("availability", formData.availability);
        serviceData.append("location[type]", formData.locationType);
        serviceData.append("location[coordinates][0]", formData.coordinates[0]);
        serviceData.append("location[coordinates][1]", formData.coordinates[1]);

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
            router.push("/dashboard/services");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add service.");
        } finally {
            setLoading(false); // Stop loading after request completion
        }
    };

    return (
        <motion.div className="max-w-2xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
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
                        <label className="block text-sm font-medium">Title</label>
                        <input
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
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Coordinates Input */}
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium">Latitude</label>
                            <input
                                type="text"
                                value={formData.coordinates[0]}
                                onChange={(e) => handleCoordinateChange(0, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Longitude</label>
                            <input
                                type="text"
                                value={formData.coordinates[1]}
                                onChange={(e) => handleCoordinateChange(1, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleDropdownChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pricing Amount Input */}
                    <div>
                        <label className="block text-sm font-medium">Pricing Amount</label>
                        <input
                            type="number"
                            name="pricingAmount"
                            value={formData.pricingAmount}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Pricing Unit Input */}
                    <div>
                        <label className="block text-sm font-medium">Pricing Unit</label>
                        <input
                            type="text"
                            name="pricingUnit"
                            value={formData.pricingUnit}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Pricing Type Input */}
                    <div>
                        <label className="block text-sm font-medium">Pricing Type</label>
                        <input
                            type="text"
                            name="pricingType"
                            value={formData.pricingType}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Availability Input */}
                    <div>
                        <label className="block text-sm font-medium">Availability</label>
                        <input
                            type="text"
                            name="availability"
                            value={formData.availability}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Images Input */}
                    <div>
                        <label className="block text-sm font-medium">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
                    >
                        Register Service
                    </button>
                </form>
            )}
        </motion.div>
    );
};

export default AddService;
