import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchDynamicFields } from "../slices/dynamicFieldsSlice";
import {
  FaUser,
  FaEnvelopeOpenText,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWarehouse,
} from "react-icons/fa";
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
      businessEmail: "",
      website: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      youtube: "",
    },
    certifications: [],
    workingHours: {
      working_days: [],
      working_start_time: "",
      working_end_time: "",
    },
    subscriptionPlan: "Basic",
    noOfOrders: 0,
  });

  const dispatch = useDispatch();
  const [customValue, setCustomValue] = useState(""); // Store custom input value
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filePreviews, setFilePreviews] = useState({
    logo: null,
    banner: null,
  });
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const { data, load, error } = useSelector((state) => state.dynamicFields);
  const certifications = data?.certifications;

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      dispatch(fetchDynamicFields());
    }
  }, [dispatch, data]);

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
      const updatedCertifications = prev.certifications.filter(
        (c) => c !== customValue
      );
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
      [
        "website",
        "businessEmail",
        "facebook",
        "instagram",
        "linkedin",
        "youtube",
      ].includes(name)
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

  const handleCoordinatesChange = (coordinates) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates, // Update the coordinates array
      },
    }));
  };

  const handleWorkingHoursChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        working_days: selectedOptions
          ? selectedOptions.map((option) => option.value)
          : [],
      },
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

  // Helper function to convert 24-hour time to 12-hour format
  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    hourInt = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${hourInt}${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Data Before Transformation:", formData);

    try {
      const formDataToSubmit = new FormData();

      // Append simple fields
      formDataToSubmit.append("businessName", formData.businessName);
      formDataToSubmit.append("businessType", formData.businessType);
      formDataToSubmit.append(
        "years_of_experience",
        formData.years_of_experience
      );
      formDataToSubmit.append("expertise_level", formData.expertise_level);
      formDataToSubmit.append("description", formData.description);

      // Construct workingHours as a string
      const { working_days, working_start_time, working_end_time } =
        formData.workingHours;
      let workingHoursString = "";
      if (working_days.length > 0 && working_start_time && working_end_time) {
        workingHoursString = `${working_days.join("-")}: ${convertTo12HourFormat(
          working_start_time
        )}-${convertTo12HourFormat(working_end_time)}`;
      }
      formDataToSubmit.append("workingHours", workingHoursString);

      formDataToSubmit.append(
        "subscriptionPlan",
        formData.subscriptionPlan || "Basic"
      );
      formDataToSubmit.append("noOfOrders", formData.noOfOrders || 0);

      // Append certifications as multiple fields
      formData.certifications.forEach((cert) => {
        formDataToSubmit.append("certifications", cert);
      });

      // Append contact_info fields
      formData.contact_info.phoneNumbers.forEach((phone) => {
        if (phone.trim() !== "") {
          formDataToSubmit.append("contact_info.phoneNumbers", phone);
        }
      });
      formDataToSubmit.append(
        "contact_info.businessEmail",
        formData.contact_info.businessEmail
      );
      formDataToSubmit.append(
        "contact_info.website",
        formData.contact_info.website
      );
      formDataToSubmit.append(
        "contact_info.facebook",
        formData.contact_info.facebook
      );
      formDataToSubmit.append(
        "contact_info.instagram",
        formData.contact_info.instagram
      );
      formDataToSubmit.append(
        "contact_info.linkedin",
        formData.contact_info.linkedin
      );
      formDataToSubmit.append(
        "contact_info.youtube",
        formData.contact_info.youtube
      );

      // Append location fields with correct order [latitude, longitude]
      if (formData.location.coordinates.length >= 2) {
        const [latitude, longitude] = formData.location.coordinates;
        formDataToSubmit.append("location.type", "Point");
        formDataToSubmit.append("location.coordinates", longitude);
        formDataToSubmit.append("location.coordinates", latitude);
      } else {
        // Handle cases where coordinates are not properly set
        toast.error("Please provide valid location coordinates.");
        setLoading(false);
        return;
      }


      // Append files
      if (formData.logo) {
        formDataToSubmit.append("logo", formData.logo);
      }
      if (formData.banner) {
        formDataToSubmit.append("banner", formData.banner);
      }

      console.log(
        "Transformed FormData:",
        Object.fromEntries(formDataToSubmit.entries())
      );

      // POST data to API
      const response = await axios.post(
        "https://industradz-backend-new.onrender.com/api/business",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
      console.log("response:", response.data)
        toast.success("Business registered successfully!");
        // Optionally, reset the form or redirect the user
        setFormData({
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
            businessEmail: "",
            website: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            youtube: "",
          },
          certifications: [],
          workingHours: {
            working_days: [],
            working_start_time: "",
            working_end_time: "",
          },
          subscriptionPlan: "Basic",
          noOfOrders: 0,
        });
        setFilePreviews({
          logo: null,
          banner: null,
        });
        setCustomValue("");
        setShowCustomInput(false);
        navigate("/dashboard");
      } else {
        throw new Error(
          response.data.message || "Failed to register business."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
        "An error occurred while registering your business."
      );
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
        <h2 className="text-4xl font-bold mb-6 text-center text-orange">
          Register Your Business
        </h2>

        {/* Location Input */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Location</label>
          <LocationInput onCoordinatesChange={handleCoordinatesChange} />
        </div>

        {/* Dynamic Input Fields */}
        {[
          {
            label: "Name",
            name: "businessName",
            type: "text",
            placeholder: "Enter business name",
            required: true,
            icon: FaUser,
          },
          {
            label: "Description",
            name: "description",
            type: "textarea",
            placeholder: "Enter business description",
            required: true,
            icon: FaEnvelopeOpenText,
          },
          {
            label: "Business Email",
            name: "businessEmail",
            type: "email",
            placeholder: "Enter business email",
            required: true,
            icon: FaEnvelopeOpenText,
          },
          {
            label: "Website",
            name: "website",
            type: "text",
            placeholder: "Enter Website URL",
            required: true,
            icon: FaEnvelopeOpenText,
          },
          {
            label: "Facebook",
            name: "facebook",
            type: "text",
            placeholder: "Enter Facebook URL",
            required: false,
            icon: FaFacebook,
          },
          {
            label: "Instagram",
            name: "instagram",
            type: "text",
            placeholder: "Enter Instagram URL",
            required: false,
            icon: FaInstagram,
          },
          {
            label: "LinkedIn",
            name: "linkedin",
            type: "text",
            placeholder: "Enter LinkedIn profile",
            required: false,
            icon: FaLinkedin,
          },
          {
            label: "YouTube",
            name: "youtube",
            type: "text",
            placeholder: "Enter YouTube URL",
            required: false,
            icon: FaYoutube,
          },
        ].map(
          ({ label, name, type, placeholder, required, icon: Icon }) => (
            <div key={name} className="mb-4">
              <label className="block text-gray-600 mb-2">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={placeholder}
                  value={
                    name === "businessName" || name === "description"
                      ? formData[name]
                      : formData.contact_info[name] || ""
                  }
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
                    value={
                      name === "businessName" || name === "description"
                        ? formData[name]
                        : formData.contact_info[name] || ""
                    }
                    onChange={handleChange}
                    required={required}
                  />
                </div>
              )}
            </div>
          )
        )}

        {/* Phone Numbers */}
        {[
          {
            label: "Phone Number",
            name: "phoneNumber1",
            type: "text",
            placeholder: "Enter phone number",
            required: true,
            icon: FaPhone,
          },
          {
            label: "Telephone Number (optional)",
            name: "phoneNumber2",
            type: "text",
            placeholder: "Enter telephone number",
            required: false,
            icon: FaPhone,
          },
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

        {/* Years of Experience */}
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
              min="0"
            />
          </div>
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
            <input
              type="time"
              name="working_start_time"
              value={formData.workingHours?.working_start_time || ""}
              onChange={handleTimeChange}
              className="w-1/2 px-4 py-2 border rounded-lg"
              required={formData.workingHours.working_days.length > 0}
            />
            <span className="self-center">to</span>
            <input
              type="time"
              name="working_end_time"
              value={formData.workingHours?.working_end_time || ""}
              onChange={handleTimeChange}
              className="w-1/2 px-4 py-2 border rounded-lg"
              required={formData.workingHours.working_days.length > 0}
            />
          </div>
        </div>

        {/* Business Type */}
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
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Expertise Level */}
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
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
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
        {["logo", "banner"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-600 mb-2">
              {field === "logo" ? "Logo" : "Banner"}
            </label>
            <input
              type="file"
              name={field}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg text-gray-600"
              onChange={(e) => handleFileChange(e, field)}
              required={field === "logo" || field === "banner"}
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
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg text-white bg-orange hover:bg-orange transition duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Business"}
        </button>
      </form>
    </div>
  );
};

export default ProfileCreation;
