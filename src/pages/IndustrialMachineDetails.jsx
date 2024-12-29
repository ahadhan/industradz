// src/pages/IndustrialMachineDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useCookies } from 'react-cookie';

const IndustrialMachineDetails = () => {
    const { id } = useParams(); // Extract the machine ID from the URL
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [machineDetails, setMachineDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseURL = "https://industradz-backend-new.onrender.com";

    const [formData, setFormData] = useState({
        machine_name: '',
        machine_des: '',
        powerAmount: '',
        powerUnit: '',
        productionCapacityAmount: '',
        productionCapacityUnit: '',
        weightAmount: '',
        weightUnit: '',
        warrantyAmount: '',
        warrantyUnit: '',
        machine_type: '',
        condition: '',
        brand: '',
        model: '',
        model_year: '',
        fixed_price: false,
        negotiable_price: false,
        price: '',
        currency: '',
        location_country: '',
        location_city: '',
        dimensions: '',
        availability: '',
        financingOptions: '',
        after_sales_service: false,
        accessories_included: false,
        ratings: '',
        spare_parts_available: false,
        status: '',
        // Add other fields as necessary
    });

    useEffect(() => {
        const fetchMachineDetails = async () => {
            try {
                const token = cookies.token;
                if (!token) {
                    toast.error('Authentication token not found. Please log in.');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${baseURL}/api/machinery/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    console.log(response.data.data);
                    const data = response.data.data;
                    setMachineDetails(data);
                    setFormData({
                        machine_name: data.machine_name || '',
                        machine_des: data.machine_des || '',
                        powerAmount: data.power?.amount || '',
                        powerUnit: data.power?.unit || '',
                        productionCapacityAmount: data.productionCapacity?.amount || '',
                        productionCapacityUnit: data.productionCapacity?.unit || '',
                        weightAmount: data.weight?.amount || '',
                        weightUnit: data.weight?.unit || '',
                        warrantyAmount: data.warranty?.amount || '',
                        warrantyUnit: data.warranty?.unit || '',
                        machine_type: data.machine_type || '',
                        condition: data.condition || '',
                        brand: data.brand || '',
                        model: data.model || '',
                        model_year: data.model_year || '',
                        fixed_price: data.fixed_price || false,
                        negotiable_price: data.negotiable_price || false,
                        price: data.price || '',
                        currency: data.currency || '',
                        location_country: data.location_country || '',
                        location_city: data.location_city || '',
                        dimensions: data.dimensions || '',
                        availability: data.availability || '',
                        financingOptions: data.financingOptions || '',
                        after_sales_service: data.after_sales_service || false,
                        accessories_included: data.accessories_included || false,
                        ratings: data.ratings || '',
                        spare_parts_available: data.spare_parts_available || false,
                        status: data.status || '',
                        // Initialize other fields as necessary
                    });
                } else {
                    setError('Failed to fetch machine details.');
                    toast.error('Failed to fetch machine details.');
                }
            } catch (err) {
                console.error('Error fetching machine details:', err);
                setError('An error occurred while fetching machine details.');
                toast.error('An error occurred while fetching machine details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMachineDetails();
    }, [id, cookies.token, navigate, baseURL]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = cookies.token; // Retrieve token from cookies
        console.log('Authentication Token:', token); // Debugging

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
            'condition',
            'price',
            'currency',
            'location_country',
            'powerAmount',
            'powerUnit',
            'productionCapacityAmount',
            'productionCapacityUnit',
            'weightAmount',
            'weightUnit',
            'warrantyAmount',
            'warrantyUnit',
            // Add other required fields as necessary
        ];

        let isValid = true;
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                isValid = false;
                const formattedField = field
                    .replace(/([A-Z])/g, ' $1')
                    .replace('.', ' ');
                toast.error(`Please fill in the ${formattedField} field.`);
            }
        });

        if (!isValid) {
            setLoading(false);
            return;
        }

        try {
            const updatedData = {
                machine_name: formData.machine_name,
                machine_des: formData.machine_des,
                power: {
                    amount: formData.powerAmount,
                    unit: formData.powerUnit,
                },
                productionCapacity: {
                    amount: formData.productionCapacityAmount,
                    unit: formData.productionCapacityUnit,
                },
                weight: {
                    amount: formData.weightAmount,
                    unit: formData.weightUnit,
                },
                warranty: {
                    amount: formData.warrantyAmount,
                    unit: formData.warrantyUnit,
                },
                machine_type: formData.machine_type,
                condition: formData.condition,
                brand: formData.brand,
                model: formData.model,
                model_year: formData.model_year,
                fixed_price: formData.fixed_price,
                negotiable_price: formData.negotiable_price,
                price: formData.price,
                currency: formData.currency,
                location_country: formData.location_country,
                location_city: formData.location_city,
                dimensions: formData.dimensions,
                availability: formData.availability,
                financingOptions: formData.financingOptions,
                after_sales_service: formData.after_sales_service,
                accessories_included: formData.accessories_included,
                ratings: formData.ratings,
                spare_parts_available: formData.spare_parts_available,
                status: formData.status,
                // Include other fields as necessary
            };

            console.log('Updated Data:', updatedData); // Debugging

            const response = await axios.put(
                `${baseURL}/api/machinery/${id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json', // Changed to application/json
                        Authorization: `Bearer ${token}`, // Include the token here
                    },
                }
            );

            console.log('API Response:', response); // Debugging

            if (response.data.success) {
                setMachineDetails(response.data.data);
                toast.success('Machine details updated successfully!');
                navigate("/dashboard/services/marketplace/industrial-machines");
            } else {
                toast.error('Failed to update machine details.');
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error updating machine details:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired or invalid. Please log in again.');
                removeCookie('token'); // Remove the 'token' cookie
                navigate('/login'); // Redirect to login page
            } else {
                toast.error(
                    error.response?.data?.message || 'An error occurred while updating machine details.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Edit Machine Details</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    {/* Basic Information */}
                    <fieldset className="mb-6">
                        <legend className="text-xl font-semibold mb-4">Basic Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Machine Name */}
                            <div>
                                <label htmlFor="machine_name" className="block text-sm font-medium text-gray-700">
                                    Machine Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="machine_name"
                                    name="machine_name"
                                    value={formData.machine_name}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                />
                            </div>
                            {/* Model Year */}
                            <div>
                                <label htmlFor="model_year" className="block text-sm font-medium text-gray-700">
                                    Model Year<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="model_year"
                                    name="model_year"
                                    value={formData.model_year}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>
                            {/* Machine Type */}
                            <div>
                                <label htmlFor="machine_type" className="block text-sm font-medium text-gray-700">
                                    Machine Type<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="machine_type"
                                    name="machine_type"
                                    value={formData.machine_type}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                />
                            </div>
                            {/* Condition */}
                            <div>
                                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                                    Condition<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                >
                                    <option value="">Select Condition</option>
                                    <option value="New">New</option>
                                    <option value="Used">Used</option>
                                    <option value="Refurbished">Refurbished</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Technical Specifications */}
                    <fieldset className="mb-6">
                        <legend className="text-xl font-semibold mb-4">Technical Specifications</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Power */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Power</label>
                                <div className="flex space-x-2 mt-1">
                                    <input
                                        type="number"
                                        name="powerAmount"
                                        value={formData.powerAmount}
                                        onChange={handleInputChange}
                                        placeholder="Amount"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                    <input
                                        type="text"
                                        name="powerUnit"
                                        value={formData.powerUnit}
                                        onChange={handleInputChange}
                                        placeholder="Unit"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                </div>
                            </div>
                            {/* Production Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Production Capacity</label>
                                <div className="flex space-x-2 mt-1">
                                    <input
                                        type="number"
                                        name="productionCapacityAmount"
                                        value={formData.productionCapacityAmount}
                                        onChange={handleInputChange}
                                        placeholder="Amount"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                    <input
                                        type="text"
                                        name="productionCapacityUnit"
                                        value={formData.productionCapacityUnit}
                                        onChange={handleInputChange}
                                        placeholder="Unit"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                </div>
                            </div>
                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Weight</label>
                                <div className="flex space-x-2 mt-1">
                                    <input
                                        type="number"
                                        name="weightAmount"
                                        value={formData.weightAmount}
                                        onChange={handleInputChange}
                                        placeholder="Amount"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                    <input
                                        type="text"
                                        name="weightUnit"
                                        value={formData.weightUnit}
                                        onChange={handleInputChange}
                                        placeholder="Unit"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                </div>
                            </div>
                            {/* Warranty */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Warranty</label>
                                <div className="flex space-x-2 mt-1">
                                    <input
                                        type="number"
                                        name="warrantyAmount"
                                        value={formData.warrantyAmount}
                                        onChange={handleInputChange}
                                        placeholder="Amount"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                    <input
                                        type="text"
                                        name="warrantyUnit"
                                        value={formData.warrantyUnit}
                                        onChange={handleInputChange}
                                        placeholder="Unit"
                                        required
                                        className="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Additional Details */}
                    <fieldset className="mb-6">
                        <legend className="text-xl font-semibold mb-4">Additional Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Brand */}
                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                                    Brand<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                />
                            </div>
                            {/* Model */}
                            <div>
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                                    Model<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                />
                            </div>
                            {/* Currency */}
                            <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                    Currency<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    placeholder="e.g., USD, EUR"
                                />
                            </div>
                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            {/* Location Country */}
                            <div>
                                <label htmlFor="location_country" className="block text-sm font-medium text-gray-700">
                                    Country<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location_country"
                                    name="location_country"
                                    value={formData.location_country}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                />
                            </div>
                            {/* Location City */}
                            <div>
                                <label htmlFor="location_city" className="block text-sm font-medium text-gray-700">
                                    City<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location_city"
                                    name="location_city"
                                    value={formData.location_city}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Pricing Details */}
                    <fieldset className="mb-6">
                        <legend className="text-xl font-semibold mb-4">Pricing Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Fixed Price */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="fixed_price"
                                    name="fixed_price"
                                    checked={formData.fixed_price}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="fixed_price" className="ml-2 block text-sm text-gray-700">
                                    Fixed Price
                                </label>
                            </div>
                            {/* Negotiable Price */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="negotiable_price"
                                    name="negotiable_price"
                                    checked={formData.negotiable_price}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="negotiable_price" className="ml-2 block text-sm text-gray-700">
                                    Negotiable Price
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    {/* Features */}
                    <fieldset className="mb-6">
                        <legend className="text-xl font-semibold mb-4">Features</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* After Sales Service */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="after_sales_service"
                                    name="after_sales_service"
                                    checked={formData.after_sales_service}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="after_sales_service" className="ml-2 block text-sm text-gray-700">
                                    After Sales Service
                                </label>
                            </div>
                            {/* Accessories Included */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="accessories_included"
                                    name="accessories_included"
                                    checked={formData.accessories_included}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="accessories_included" className="ml-2 block text-sm text-gray-700">
                                    Accessories Included
                                </label>
                            </div>
                            {/* Spare Parts Available */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="spare_parts_available"
                                    name="spare_parts_available"
                                    checked={formData.spare_parts_available}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="spare_parts_available" className="ml-2 block text-sm text-gray-700">
                                    Spare Parts Available
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    {/* Status */}
                    <fieldset className="mb-6">
                        <legend className="text-xl font-semibold mb-4">Status</legend>
                        <div className="flex items-center">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="ml-4 block w-1/2 rounded-md border-gray-300 bg-white shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                            >
                                <option value="">Select Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </fieldset>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className={`bg-orange text-white font-bold py-2 px-6 rounded-md shadow hover:bg-orange-600 transition-colors duration-300 w-full flex justify-center items-center ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>

                {/* Preview Section */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Preview</h2>
                    <div className="space-y-4">
                        {/* Machine Name */}
                        <div>
                            <span className="font-medium text-gray-700">Name:</span> {formData.machine_name || 'N/A'}
                        </div>
                        {/* Description */}
                        <div>
                            <span className="font-medium text-gray-700">Description:</span> {formData.machine_des || 'N/A'}
                        </div>
                        {/* Power */}
                        <div>
                            <span className="font-medium text-gray-700">Power:</span> {formData.powerAmount} {formData.powerUnit || 'N/A'}
                        </div>
                        {/* Production Capacity */}
                        <div>
                            <span className="font-medium text-gray-700">Production Capacity:</span> {formData.productionCapacityAmount} {formData.productionCapacityUnit || 'N/A'}
                        </div>
                        {/* Weight */}
                        <div>
                            <span className="font-medium text-gray-700">Weight:</span> {formData.weightAmount} {formData.weightUnit || 'N/A'}
                        </div>
                        {/* Warranty */}
                        <div>
                            <span className="font-medium text-gray-700">Warranty:</span> {formData.warrantyAmount} {formData.warrantyUnit || 'N/A'}
                        </div>
                        {/* Machine Type */}
                        <div>
                            <span className="font-medium text-gray-700">Machine Type:</span> {formData.machine_type || 'N/A'}
                        </div>
                        {/* Condition */}
                        <div>
                            <span className="font-medium text-gray-700">Condition:</span> {formData.condition || 'N/A'}
                        </div>
                        {/* Brand */}
                        <div>
                            <span className="font-medium text-gray-700">Brand:</span> {formData.brand || 'N/A'}
                        </div>
                        {/* Model */}
                        <div>
                            <span className="font-medium text-gray-700">Model:</span> {formData.model || 'N/A'}
                        </div>
                        {/* Model Year */}
                        <div>
                            <span className="font-medium text-gray-700">Model Year:</span> {formData.model_year || 'N/A'}
                        </div>
                        {/* Pricing Details */}
                        <div>
                            <span className="font-medium text-gray-700">Price:</span> {formData.currency || 'N/A'} {formData.price || 'N/A'}{' '}
                            {formData.fixed_price ? '(Fixed)' : formData.negotiable_price ? '(Negotiable)' : ''}
                        </div>
                        {/* Location */}
                        <div>
                            <span className="font-medium text-gray-700">Location:</span> {formData.location_city || 'N/A'}, {formData.location_country || 'N/A'}
                        </div>
                        {/* Dimensions */}
                        <div>
                            <span className="font-medium text-gray-700">Dimensions:</span> {formData.dimensions || 'N/A'}
                        </div>
                        {/* Availability */}
                        <div>
                            <span className="font-medium text-gray-700">Availability:</span> {formData.availability || 'N/A'}
                        </div>
                        {/* Financing Options */}
                        <div>
                            <span className="font-medium text-gray-700">Financing Options:</span> {formData.financingOptions || 'N/A'}
                        </div>
                        {/* Features */}
                        <div>
                            <span className="font-medium text-gray-700">After Sales Service:</span> {formData.after_sales_service ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Accessories Included:</span> {formData.accessories_included ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Spare Parts Available:</span> {formData.spare_parts_available ? 'Yes' : 'No'}
                        </div>
                        {/* Ratings */}
                        <div>
                            <span className="font-medium text-gray-700">Ratings:</span> {formData.ratings || 'N/A'} / 5
                        </div>
                        {/* Status */}
                        <div>
                            <span className="font-medium text-gray-700">Status:</span> {formData.status || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
            {/* Insert Toaster for Notifications */}
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );

};

export default IndustrialMachineDetails;
