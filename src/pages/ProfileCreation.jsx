


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchDynamicFields } from "../slices/dynamicFieldsSlice";
import { FaUser, FaEnvelopeOpenText, FaPhone, FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWarehouse } from "react-icons/fa";
import { toast } from "react-toastify";
import LocationInput from "./LocationInput";
import axios from "axios";
import { useCookies } from "react-cookie";


const ProfileCreation = () => {

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Independent Contractor",
    years_of_experience: "",
    expertise_level: "Beginner",
    description: "",
    logo: null,
    banner: null,
    location: { coordinates: [] },
    contact_info: {
      phoneNumbers: ["", ""],
      businessEmail: "business@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com/in/example",
      facebook: "",
      instagram: "",
      youtube: "",
    },
    certifications: [],
    workingHours: [],
  });

  const dispatch = useDispatch();
  const [options, setOptions] = useState([]); // To store dropdown 
  const [selectedOption, setSelectedOption] = useState(null);
  const [customValue, setCustomValue] = useState(""); // Store custom input value
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false)
  const [coordinates, setCoordinates] = useState([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const { data, load, error } = useSelector((state) => state.dynamicFields);
  const certifications = data?.certifications;
  console.log("Comp data:", data)

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      dispatch(fetchDynamicFields());
    }
  }, [dispatch, data]);
  const handleDropdownChange = (selected) => {
    setSelectedOption(selected); // Update the selected option
  };

  console.log("Redux State Data:", data);
  console.log("Certifications:", certifications);

  // Show loading or error states
  if (load) {
    return <p>Loading options...</p>;
  }


  const handleCheckboxChange = (e, cert) => {
    const { checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        // Add certification
        return {
          ...prev,
          certifications: [...prev.certifications, cert],
        };
      } else {
        // Remove certification
        return {
          ...prev,
          certifications: prev.certifications.filter((c) => c !== cert),
        };
      }
    });
  };

  const toggleCustomInput = (e) => {
    const { checked } = e.target;
    setShowCustomInput(checked);

    if (!checked) {
      // Remove "Other" from certifications if unchecked
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c !== customValue),
      }));
      setCustomValue("");
    }
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomValue(value);

    setFormData((prev) => {
      const updatedCertifications = prev.certifications.filter((c) => c !== customValue);
      return {
        ...prev,
        certifications: [...updatedCertifications, value],
      };
    });
  };



  const daysOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      // Parse the value as a number
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value, 10), // Handle empty input gracefully
      }));
    } else if (name === "phoneNumber1" || name === "phoneNumber2") {
      // Handle phone number updates
      const index = name === "phoneNumber1" ? 0 : 1; // Determine the index for phoneNumbers
      setFormData((prev) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          phoneNumbers: [
            ...prev.contact_info.phoneNumbers.slice(0, index),
            value, // Update the specific index
            ...prev.contact_info.phoneNumbers.slice(index + 1),
          ],
        },
      }));
    } else if (
      ["website", "businessEmail", "facebook", "instagram", "linkedin", "youtube"].includes(name)
    ) {
      // Handle other contact_info fields
      setFormData((prev) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [name]: value,
        },
      }));
    } else {
      // Handle all other fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };






  const [filePreviews, setFilePreviews] = useState({
    logo: null,
    banner: null,
  })

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];

    if (file) {
      // Generate a preview URL for display
      const previewUrl = URL.createObjectURL(file);

      // Update file previews for display
      setFilePreviews((prev) => ({
        ...prev,
        [field]: previewUrl,
      }));

      // Store the file in formData
      setFormData((prev) => ({
        ...prev,
        [field]: file, // Store the File object for backend processing
      }));
    }
  };



  const handleContactInfoChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value,
      },
    }));
  };


  const handlePhoneNumbersChange = (index, value) => {
    const updatedPhoneNumbers = [...formData.contact_info.phoneNumbers];
    updatedPhoneNumbers[index] = value;
    setFormData((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        phoneNumbers: updatedPhoneNumbers,
      },
    }));
  };


  const handleCoordinatesChange = (coordinates) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates, // Update the coordinates array
      },
    }));
  };


  const handleWorkingHours = (selectedOptions, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [name]: value, // Update working_start_time or working_end_time dynamically
      },
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData)

    try {
      const formDataToSubmit = new FormData();

      // Append regular fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" || key === "banner") {
          formDataToSubmit.append(key, value); // Append files
        } else if (key === "contact_info") {
          formDataToSubmit.append(key, JSON.stringify(value)); // Nested data
        } else if (key === "location") {
          formDataToSubmit.append(key, JSON.stringify(value)); // Nested location
        } else {
          formDataToSubmit.append(key, value);
        }
      });

      console.log("token:", token)
      console.log(formData)
      // POST data to API

      const response = await axios.post("https://industradz-backend-new.onrender.com/api/business", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Business registered successfully!");
      } else {
        throw new Error("Failed to register business.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while registering your business.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 py-10 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border-2 border-orange"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-orange">Register Your Business</h2>

        {/* Location Input */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Location</label>
          <LocationInput onCoordinatesChange={handleCoordinatesChange} />
        </div>

        {/* Dynamic Input Fields */}
        {[
          { label: "Name", name: "businessName", type: "text", placeholder: "Enter business name", required: true, icon: FaUser },
          { label: "Description", name: "description", type: "textarea", placeholder: "Enter business description", required: true, icon: FaEnvelopeOpenText },
          { label: "Business Email", name: "businessEmail", type: "email", placeholder: "Enter business email", required: true, icon: FaEnvelopeOpenText },
          { label: "Website", name: "website", type: "text", placeholder: "Enter Website URL", required: true, icon: FaEnvelopeOpenText },
          { label: "Facebook ", name: "facebook", type: "text", placeholder: "Enter Facebook URL", required: true, icon: FaFacebook },
          { label: "Instagram ", name: "instagram", type: "text", placeholder: "Enter Instagram URL", required: true, icon: FaInstagram },
          { label: "LinkedIn", name: "linkedin", type: "text", placeholder: "Enter LinkedIn profile", required: true, icon: FaLinkedin },
          { label: "YouTube", name: "youtube", type: "text", placeholder: "Enter YouTube URL", required: true, icon: FaYoutube },
        ].map(({ label, name, type, placeholder, required, icon: Icon }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-600 mb-2">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder={placeholder}
                value={name === "businessName" || name === "description" ? formData[name] : formData.contact_info[name] || ""}
                onChange={handleChange}
                required={required}
              />
            ) : (
              <div className="flex items-center gap-2 border px-2 rounded-lg">
                <span className="text-orange">
                  <Icon />
                </span>
                <input
                  type={type}
                  name={name}
                  className="w-full py-2 rounded-lg"
                  placeholder={placeholder}
                  value={name === "businessName" || name === "description" ? formData[name] : formData.contact_info[name] || ""}
                  onChange={handleChange}
                  required={required}
                />
              </div>
            )}
          </div>
        ))}


        {[
          { label: "Phone Number", name: "phoneNumber1", type: "text", placeholder: "Enter phone number", required: true, icon: FaPhone },
          { label: "Telephone Number (optional)", name: "phoneNumber2", type: "text", placeholder: "Enter telephone number", required: false, icon: FaPhone },
        ].map(({ label, name, type, placeholder, required, icon: Icon }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-600 mb-2">{label}</label>
            <div className="flex items-center gap-2 border px-2 rounded-lg">
              <span className="text-orange">
                <Icon />
              </span>
              <input
                type={type}
                name={name}
                className="w-full py-2 rounded-lg"
                placeholder={placeholder}
                value={
                  name === "phoneNumber1"
                    ? formData.contact_info.phoneNumbers[0] || ""
                    : formData.contact_info.phoneNumbers[1] || ""
                }
                onChange={handleChange}
                required={required}
              />
            </div>
          </div>
        ))}


        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Years of Experience</label>
          <div className="flex items-center gap-2 border px-2 rounded-lg">
            <span className="text-orange">
              <FaWarehouse />
            </span>
            <input
              type="number"
              name="years_of_experience"
              className="w-full py-2 rounded-lg"
              placeholder="Enter years of experience"
              value={formData.years_of_experience || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Working Hours */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-semibold">Working Hours</label>

          {/* Select Working Days */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Select Working Days</label>
            <Select
              isMulti
              name="working_days"
              options={daysOptions}
              value={formData.workingHours.working_days?.map((day) => ({
                value: day,
                label: day,
              }))}
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    working_days: selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : [],
                  },
                }))
              }
              className="w-full"
              placeholder="Select days"
            />
          </div>

          {/* Input Working Hours */}
          <div className="flex space-x-4">
            <input
              type="time"
              name="working_start_time"
              value={formData.workingHours?.working_start_time || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    working_start_time: e.target.value,
                  },
                }))
              }
              className="w-1/2 px-4 py-2 border rounded-lg"
              required
            />
            <span className="self-center">to</span>
            <input
              type="time"
              name="working_end_time"
              value={formData.workingHours?.working_end_time || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    working_end_time: e.target.value,
                  },
                }))
              }
              className="w-1/2 px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>


        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Business Type</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-gray-600"
            required
          >
            <option value="">Select business type</option>
            <option value="SARL">SARL</option>
            <option value="EURL">EURL</option>
            <option value="SPA">SPA</option>
            <option value="SNC">SNC</option>
            <option value="SCS">SCS</option>
            <option value="GIE">GIE</option>
            <option value="Independent Contractor">Independent Contractor</option>
            <option value="Auto - Entrepreneurs">Auto - Entrepreneurs</option>
            <option value="Freelancers">Freelancers</option>
            <option value="Cooperatives">Cooperatives</option>
            <option value="EPIC">EPIC</option>
            <option value="Public Establishments">Public Establishments</option>
            {/* Add more options */}
          </select>
        </div>


        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Expertise Level</label>
          <select
            name="expertise_level"
            value={formData.expertise_level}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-gray-600"
            required
          >
            <option value="">Select expertise level</option>
            <option value="Independent Contractor">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
            {/* Add more options */}
          </select>
        </div>

        {data.certifications && (
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Certifications</label>
            <div className="border px-4 py-2 rounded-lg">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={cert}
                    id={`cert-${index}`}
                    checked={formData.certifications.includes(cert)}
                    onChange={(e) => handleCheckboxChange(e, cert)}
                  />
                  <label htmlFor={`cert-${index}`} className="text-gray-800">
                    {cert}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  value="other"
                  id="cert-other"
                  checked={showCustomInput}
                  onChange={(e) => toggleCustomInput(e)}
                />
                <label htmlFor="cert-other" className="text-gray-800">
                  Other
                </label>
              </div>

              {showCustomInput && (
                <input
                  type="text"
                  className="w-full mt-2 px-4 py-2 border rounded-lg"
                  placeholder="Enter your certification"
                  value={customValue}
                  onChange={handleCustomInputChange}
                />
              )}
            </div>
          </div>
        )}



        {/* Logo and Banner */}
        {
          ["logo", "banner"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-600 mb-2">
                {field === "logo" ? "Logo" : "Banner"}
              </label>
              <input
                type="file"
                name={field}
                className="w-full px-4 py-2 border rounded-lg text-gray-600"
                onChange={(e) => handleFileChange(e, field)}
              />

              {filePreviews[field] && (
                <div className="preview mt-2">
                  <img
                    src={filePreviews[field]}
                    alt={`${field} preview`}
                    className="h-16 w-auto border rounded"
                  />
                </div>
              )}
            </div>
          ))
        }



        <button
          type="submit"
          className="w-full py-2 rounded-lg text-white bg-orange"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Business"}
        </button>
      </form >
    </div >
  );
};

export default ProfileCreation;
