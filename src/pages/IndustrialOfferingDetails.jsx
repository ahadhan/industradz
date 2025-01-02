// src/components/services/IndustrialOfferingDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { reverseGeocode } from '../utils/reverseGeocode';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, A11y , Autoplay } from 'swiper/modules';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon paths (necessary for React Leaflet)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const IndustrialOfferingDetails = () => {
  const { id } = useParams(); // Extract service ID from URL
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [service, setService] = useState(null);
  const [businessLocation, setBusinessLocation] = useState({ city: '', country: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricing: { amount: '', unit: '' },
    pricingType: '',
    // Add other fields as necessary
  });
  const [updating, setUpdating] = useState(false);

  // Base URL
  const baseURL = 'https://industradz-backend-new.onrender.com';

  // Fetch Service Data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = cookies.token;

        if (!token) {
          toast.error('You are not logged in. Please log in first.');
          navigate('/login'); // Redirect to login if not authenticated
          return;
        }

        const response = await axios.get(`${baseURL}/api/service/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data.workingHours.days)
        if (response.data.success) {
          setService(response.data.data);
          setFormData({
            title: response.data.data.title || '',
            description: response.data.data.description || '',
            category: response.data.data.category || '',
            pricing: {
              amount: response.data.data.pricing?.amount || '',
              unit: response.data.data.pricing?.unit || '',
            },
            pricingType: response.data.data.pricingType || '',
            // Populate other fields as necessary
          });

          // Extract coordinates
          const coordinates = response.data.data.business.location.coordinates;
          const [longitude, latitude] = coordinates; // [lng, lat]

          // Perform Reverse Geocoding
          const location = await reverseGeocode(latitude, longitude);
          setBusinessLocation(location);
        } else {
          toast.error(response.data.message || 'Failed to fetch service details.');
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch service details.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, cookies.token, navigate]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields like pricing.amount
    if (name.startsWith('pricing.')) {
      const field = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        pricing: {
          ...prevData.pricing,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = cookies.token;

      if (!token) {
        toast.error('You are not logged in. Please log in first.');
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      const updatedService = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        pricing: {
          amount: formData.pricing.amount,
          unit: formData.pricing.unit,
        },
        pricingType: formData.pricingType,
        // Add other fields as necessary
      };

      const response = await axios.put(`${baseURL}/api/service/${id}`, updatedService, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('Service updated successfully!');
        // Optionally, redirect or update state
        navigate('/dashboard/services/industrials-offering'); // Redirect to list page
      } else {
        toast.error(response.data.message || 'Failed to update service.');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(error.response?.data?.message || 'Failed to update service.');
    } finally {
      setUpdating(false);
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  // Render Error State if Service Not Found
  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Service not found.</p>
      </div>
    );
  }

  // Destructure Service Data for Easier Access
  const {
    images,
    business,
    status,
    createdAt,
    updatedAt,
    // Add other fields as necessary
  } = service;

  const {
    businessName,
    businessType,
    years_of_experience,
    contact_info,
    description: businessDescription,
    certifications,
    workingHours,
    subscriptionPlan,
    noOfOrders,
    logo,
    banner,
    ratings,
    expertise_level,
    website,
    location: businessLocationData, // Assuming business has a location field
  } = business;

  // Format Dates
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const formattedUpdatedAt = new Date(updatedAt).toLocaleDateString();

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster />
      {/* Banner Image */}
      {banner && (
        <img
          src={banner}
          alt={`${businessName} Banner`}
          className="w-full h-64 object-cover rounded-md"
        />
      )}

      {/* Header Section */}
      <div className="flex items-center mt-4">
        {/* Business Logo */}
        {logo && (
          <img
            src={logo}
            alt={`${businessName} Logo`}
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
          />
        )}
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{businessName}</h1>
          <p className="text-gray-600">{businessType}</p>
          <p className="text-gray-600">
            {years_of_experience} {years_of_experience > 1 ? 'Years' : 'Year'} of Experience
          </p>
        </div>
      </div>

      {/* Service Details and Edit Form */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Edit Service Details</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={4}
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-medium">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Pricing Type */}
          <div>
            <label htmlFor="pricingType" className="block font-medium">
              Pricing Type
            </label>
            <input
              type="text"
              id="pricingType"
              name="pricingType"
              value={formData.pricingType}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Pricing Amount */}
          <div>
            <label htmlFor="pricing.amount" className="block font-medium">
              Pricing Amount
            </label>
            <input
              type="number"
              id="pricing.amount"
              name="pricing.amount"
              value={formData.pricing.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Pricing Unit */}
          <div>
            <label htmlFor="pricing.unit" className="block font-medium">
              Pricing Unit
            </label>
            <input
              type="text"
              id="pricing.unit"
              name="pricing.unit"
              value={formData.pricing.unit}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={updating}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              {updating ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Gallery */}
      {images && images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Images</h3>
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="mySwiper mt-2"
          >
            {images.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imgUrl}
                  alt={`Service Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Business Description */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">About {businessName}</h3>
        <p className="mt-2 text-gray-700">{businessDescription}</p>
      </div>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <ul className="list-disc list-inside mt-2 text-gray-700">
            {certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact Information */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Contact Information</h3>
        <p className="mt-2">
          <span className="font-medium">Phone Numbers:</span>{' '}
          {contact_info.phoneNumbers.join(', ')}
        </p>
        <p className="mt-2">
          <span className="font-medium">Business Email:</span>{' '}
          <a
            href={`mailto:${contact_info.businessEmail}`}
            className="text-blue-600 underline"
          >
            {contact_info.businessEmail}
          </a>
        </p>
        {contact_info.facebook && (
          <p className="mt-2">
            <span className="font-medium">Facebook:</span>{' '}
            <a
              href={contact_info.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {contact_info.facebook}
            </a>
          </p>
        )}
        {contact_info.linkedin && (
          <p className="mt-2">
            <span className="font-medium">LinkedIn:</span>{' '}
            <a
              href={contact_info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {contact_info.linkedin}
            </a>
          </p>
        )}
        {website && (
          <p className="mt-2">
            <span className="font-medium">Website:</span>{' '}
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {website}
            </a>
          </p>
        )}
      </div>

      {/* Working Hours */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Working Hours</h3>
        <p className="mt-2 text-gray-700">{workingHours}</p>
      </div>

      {/* Ratings */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Ratings</h3>
        <p className="mt-2 text-gray-700">{ratings} Stars</p>
      </div>

      {/* Additional Business Info */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Additional Information</h3>
        <p className="mt-2">
          <span className="font-medium">Expertise Level:</span>{' '}
          {expertise_level}
        </p>
        <p className="mt-2">
          <span className="font-medium">Subscription Plan:</span>{' '}
          {subscriptionPlan}
        </p>
        <p className="mt-2">
          <span className="font-medium">Number of Orders:</span>{' '}
          {noOfOrders}
        </p>
      </div>

      {/* Business Location */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Business Location</h3>
        <p className="mt-2 text-gray-700">
          {businessLocation.city}, {businessLocation.country}
        </p>
        {/* Map Integration */}
        {businessLocation.city !== 'Unknown' && businessLocation.country !== 'Unknown' && (
          <div className="mt-4">
            <MapContainer
              center={[service.business.location.coordinates[1], service.business.location.coordinates[0]]}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-64 rounded-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[service.business.location.coordinates[1], service.business.location.coordinates[0]]}>
                <Popup>
                  {businessName} - {businessType}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200"
        >
          &larr; Back to Offerings
        </button>
      </div>
    </motion.div>
  );
};

export default IndustrialOfferingDetails;
