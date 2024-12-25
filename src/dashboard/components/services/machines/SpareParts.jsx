import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import { useCookies } from "react-cookie"; // Import useCookies

// Define options for enums
const conditionOptions = [
  { value: "New", label: "New" },
  { value: "Used", label: "Used" },
  { value: "Refurbished", label: "Refurbished" },
];

const availabilityOptions = [
  { value: "In Stock", label: "In Stock" },
  { value: "Out of Stock", label: "Out of Stock" },
  { value: "Available on Order", label: "Available on Order" },
];

const SparePartsOffering = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token']); // Access token and removeCookie
  const [formData, setFormData] = useState({
    partCategory: "",
    subCategory: "",
    description: "",
    compatibleBrands: [],
    compatibleModels: [],
    condition: "",
    fixedPrice: true,
    negotiablePrice: false,
    price: "",
    currency: "DZD",
    spareParts_images: [],
    locationCountry: "",
    locationCity: "",
    availability: "In Stock",
    warranty: {
      amount: "",
      unit: "years",
    },
    bulkDiscountsAvailable: false,
    bulkDiscounts: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false); // Loading state for categories
  const [categories, setCategories] = useState([]); // To store fetched categories
  const [selectedCategory, setSelectedCategory] = useState(null); // Currently selected category

  // Define maximum number of images allowed
  const MAX_IMAGES = 5;

  // Fetch categories and related data from the API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        // Replace with your actual API endpoint
        const apiUrl = "https://industradz-backend-new.onrender.com/api/dynamic-fields"; // Example URL
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });

        if (response.data.success) {
          setCategories(response.data.data.sparePartCategories);
        } else {
          toast.error(response.data.message || "Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("An error occurred while fetching categories.");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, [cookies.token]);

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
    if (name === "partCategory") {
      const category = categories.find(cat => cat.category === selectedOption.value);
      setSelectedCategory(category || null);
      setFormData((prevData) => ({
        ...prevData,
        partCategory: selectedOption ? selectedOption.value : "",
        subCategory: "",
        compatibleBrands: [],
        compatibleModels: [],
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: selectedOption ? selectedOption.value : "" }));
    }
  };

  // Handle Select changes for multi-select fields
  const handleMultiSelectChange = (selectedOptions, { name }) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData((prevData) => ({ ...prevData, [name]: values }));
  };

  // Handle file input with image limit
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const totalImages = selectedFiles.length + formData.spareParts_images.length;

      if (totalImages > MAX_IMAGES) {
        const allowedFiles = selectedFiles.slice(0, MAX_IMAGES - formData.spareParts_images.length);
        setFormData((prevData) => ({
          ...prevData,
          spareParts_images: [...prevData.spareParts_images, ...allowedFiles],
        }));
        toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          spareParts_images: [...prevData.spareParts_images, ...selectedFiles],
        }));
      }
    }
  };

  // Function to remove a selected image
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.spareParts_images];
    updatedImages.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, spareParts_images: updatedImages }));
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
      'partCategory',
      'subCategory',
      'description',
      'compatibleBrands',
      'compatibleModels',
      'condition',
      'price',
      'currency',
      'locationCountry',
      'locationCity',
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
      if (
        (Array.isArray(value) && value.length === 0) || // For arrays
        (!Array.isArray(value) && !value) // For other fields
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
    if (formData.spareParts_images.length === 0) {
      isValid = false;
      toast.error("Please upload at least one spare part image.");
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const sparePartData = new FormData();
    sparePartData.append("partCategory", formData.partCategory);
    sparePartData.append("subCategory", formData.subCategory);
    sparePartData.append("description", formData.description);
    sparePartData.append("condition", formData.condition);
    sparePartData.append("fixedPrice", formData.fixedPrice);
    sparePartData.append("negotiablePrice", formData.negotiablePrice);
    sparePartData.append("price", formData.price);
    sparePartData.append("currency", formData.currency);
    sparePartData.append("locationCountry", formData.locationCountry);
    sparePartData.append("locationCity", formData.locationCity);
    sparePartData.append("availability", formData.availability);
    sparePartData.append("bulkDiscountsAvailable", formData.bulkDiscountsAvailable);
    sparePartData.append("bulkDiscounts", formData.bulkDiscounts);

    // Append arrays
    formData.compatibleBrands.forEach((brand, index) => {
      sparePartData.append(`compatibleBrands[${index}]`, brand);
    });
    formData.compatibleModels.forEach((model, index) => {
      sparePartData.append(`compatibleModels[${index}]`, model);
    });

    // Append nested objects
    sparePartData.append("warranty.amount", formData.warranty.amount);
    sparePartData.append("warranty.unit", formData.warranty.unit);

    // Append images
    formData.spareParts_images.forEach((image, index) => {
      sparePartData.append("spareParts_images", image);
    });

    try {
      // Replace the placeholder URL with your actual API endpoint
      const apiUrl = "https://your-backend-api.com/api/spare-parts-offering"; // Replace with your API URL

      const response = await axios.post(apiUrl, sparePartData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Spare Part registered successfully!");
        navigate("/dashboard/spare-parts"); // Redirect to spare parts dashboard or desired page
      } else {
        toast.error(response.data.message || "Failed to register spare part.");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error === "Invalid token") {
        toast.error("Session expired or invalid. Please log in again.");
        removeCookie('token'); // Remove the 'token' cookie
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(error.response?.data?.message || "Failed to register spare part.");
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
      <h2 className="text-xl font-bold mb-4 text-orange">Register Spare Part</h2>
      {fetchingCategories ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Part Category */}
          <div>
            <label htmlFor="partCategory" className="block text-sm font-medium">
              Part Category<span className="text-red-500">*</span>
            </label>
            <Select
              id="partCategory"
              name="partCategory"
              options={categories.map(cat => ({ value: cat.category, label: cat.category }))}
              value={categories
                .filter(cat => cat.category === formData.partCategory)
                .map(cat => ({ value: cat.category, label: cat.category }))}
              onChange={handleSelectChange}
              className="w-full"
              placeholder="Select Part Category"
              isClearable
              required
            />
          </div>

          {/* Sub Category */}
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium">
              Sub Category<span className="text-red-500">*</span>
            </label>
            <Select
              id="subCategory"
              name="subCategory"
              options={
                selectedCategory
                  ? selectedCategory.subCategories.map(sub => ({ value: sub, label: sub }))
                  : []
              }
              value={
                selectedCategory
                  ? selectedCategory.subCategories
                      .filter(sub => sub === formData.subCategory)
                      .map(sub => ({ value: sub, label: sub }))
                  : []
              }
              onChange={handleSelectChange}
              className="w-full"
              placeholder={selectedCategory ? "Select Sub Category" : "Select Part Category First"}
              isClearable
              isDisabled={!selectedCategory}
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

          {/* Compatible Brands */}
          <div>
            <label htmlFor="compatibleBrands" className="block text-sm font-medium">
              Compatible Brands<span className="text-red-500">*</span>
            </label>
            <Select
              id="compatibleBrands"
              name="compatibleBrands"
              options={
                selectedCategory && selectedCategory.compatibleBrands.length > 0
                  ? selectedCategory.compatibleBrands.map(brand => ({ value: brand, label: brand }))
                  : []
              }
              isMulti
              value={formData.compatibleBrands.map(brand => ({ value: brand, label: brand }))}
              onChange={handleMultiSelectChange}
              className="w-full"
              placeholder={
                selectedCategory && selectedCategory.compatibleBrands.length > 0
                  ? "Select Compatible Brands"
                  : "No Compatible Brands Available"
              }
              isClearable
              isDisabled={!selectedCategory || selectedCategory.compatibleBrands.length === 0}
              required
            />
          </div>

          {/* Compatible Models */}
          <div>
            <label htmlFor="compatibleModels" className="block text-sm font-medium">
              Compatible Models<span className="text-red-500">*</span>
            </label>
            <Select
              id="compatibleModels"
              name="compatibleModels"
              options={
                selectedCategory && selectedCategory.compatibleModels.length > 0
                  ? selectedCategory.compatibleModels.map(model => ({ value: model, label: model }))
                  : []
              }
              isMulti
              value={formData.compatibleModels.map(model => ({ value: model, label: model }))}
              onChange={handleMultiSelectChange}
              className="w-full"
              placeholder={
                selectedCategory && selectedCategory.compatibleModels.length > 0
                  ? "Select Compatible Models"
                  : "No Compatible Models Available"
              }
              isClearable
              isDisabled={!selectedCategory || selectedCategory.compatibleModels.length === 0}
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
              options={conditionOptions}
              value={conditionOptions.find(option => option.value === formData.condition) || null}
              onChange={handleSelectChange}
              className="w-full"
              placeholder="Select Condition"
              isClearable
              required
            />
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-2 gap-4">
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
              className="w-full border rounded px-3 py-2"
              required
              min="0"
              step="0.01"
            />
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
                className="w-full border rounded px-3 py-2"
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
                className="w-full border rounded px-3 py-2"
                required
                placeholder="years"
              />
            </div>
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

          {/* Spare Parts Images */}
          <div>
            <label htmlFor="spareParts_images" className="block text-sm font-medium">
              Spare Parts Images<span className="text-red-500">*</span>
            </label>
            <input
              id="spareParts_images"
              type="file"
              name="spareParts_images"
              multiple
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
              accept="image/*"
            />
            {/* Display current number of uploaded images */}
            <p className="text-sm text-gray-500">
              {formData.spareParts_images.length} / {MAX_IMAGES} images uploaded.
            </p>
            {/* Image Previews with Remove Option */}
            <div className="flex flex-wrap mt-2">
              {formData.spareParts_images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover mr-2 mb-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 focus:outline-none"
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
            disabled={loading || formData.spareParts_images.length === 0} // Disable if loading or no images
          >
            {loading ? "Registering..." : "Register Spare Part"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default SparePartsOffering;
