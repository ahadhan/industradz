import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import { useCookies } from "react-cookie";

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
  const [cookies] = useCookies(["token"]);
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Access dynamic fields from Redux store
  const { sparePartCategories = [] } = useSelector((state) => state.dynamicFields);

  // Handle input changes for both single and nested fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: type === "checkbox" ? checked : value },
      }));
    }
  };

  // Handle Select dropdown changes for single select fields
  const handleSelectChange = (selectedOption, { name }) => {
    if (name === "partCategory") {
      const category = sparePartCategories.find(
        (cat) => cat.category === selectedOption?.value
      );
      setSelectedCategory(category || null);
      setFormData((prev) => ({
        ...prev,
        partCategory: selectedOption ? selectedOption.value : "",
        subCategory: "",
        compatibleBrands: [],
        compatibleModels: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption ? selectedOption.value : "",
      }));
    }
  };

  // Handle Select changes for multi-select fields
  const handleMultiSelectChange = (selectedOptions, { name }) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      spareParts_images: [...prev.spareParts_images, ...files],
    }));
  };

  return (
    <motion.div
      className="max-w-2xl mt-4 mx-auto bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-bold mb-4 text-orange">Register Spare Part</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Part Category */}
        <div>
          <label htmlFor="partCategory" className="block text-sm font-medium">
            Part Category<span className="text-red-500">*</span>
          </label>
          <Select
            id="partCategory"
            name="partCategory"
            options={sparePartCategories.map((cat) => ({
              value: cat.category,
              label: cat.category,
            }))}
            value={
              sparePartCategories
                .filter((cat) => cat.category === formData.partCategory)
                .map((cat) => ({ value: cat.category, label: cat.category }))
            }
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
                ? selectedCategory.subCategories.map((sub) => ({
                    value: sub,
                    label: sub,
                  }))
                : []
            }
            value={
              selectedCategory
                ? selectedCategory.subCategories
                    .filter((sub) => sub === formData.subCategory)
                    .map((sub) => ({ value: sub, label: sub }))
                : []
            }
            onChange={handleSelectChange}
            className="w-full"
            placeholder={
              selectedCategory
                ? "Select Sub Category"
                : "Select Part Category First"
            }
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
              selectedCategory
                ? selectedCategory.compatibleBrands.map((brand) => ({
                    value: brand,
                    label: brand,
                  }))
                : []
            }
            isMulti
            value={formData.compatibleBrands.map((brand) => ({
              value: brand,
              label: brand,
            }))}
            onChange={handleMultiSelectChange}
            className="w-full"
            placeholder={
              selectedCategory
                ? "Select Compatible Brands"
                : "Select Part Category First"
            }
            isClearable
            isDisabled={!selectedCategory}
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

          <div>
          <label htmlFor="condition" className="block text-sm font-medium">
            Condition<span className="text-red-500">*</span>
          </label>

          <Select
            id="condition"
            name="condition"
            options={conditionOptions}
            value={conditionOptions.find((opt) => opt.value === formData.condition)}
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
    </motion.div>
  );
};

export default SparePartsOffering;
