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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import any additional icons or components as needed

const IndustrialOfferingDetails = () => {
  const { id } = useParams(); // Extract service ID from URL
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [service, setService] = useState(null);
  const [businessLocation, setBusinessLocation] = useState({ city: '', country: '' });
  const [loading, setLoading] = useState(true);

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

        if (response.data.success) {
          setService(response.data.data);

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
        toast.error(
          error.response?.data?.message || 'Failed to fetch service details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, cookies.token, navigate]);

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
    title,
    description,
    category,
    pricing,
    pricingType,
    images,
    business,
    status,
    reviews,
    createdAt,
    updatedAt,
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
    reviews: businessReviews,
    logo,
    banner,
    ratings,
    expertise_level,
    website,
    machines,
    spareParts,
    ratings: businessRatings,
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
            {years_of_experience} {years_of_experience > 1 ? 'Years' : 'Year'} of
            Experience
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-gray-700">{description}</p>
        <p className="mt-2">
          <span className="font-medium">Category:</span> {category}
        </p>
        <p className="mt-2">
          <span className="font-medium">Pricing Type:</span> {pricingType}
        </p>
        <p className="mt-2">
          <span className="font-medium">Pricing:</span> {pricing.amount}{' '}
          {pricing.unit}
        </p>
        <p className="mt-2">
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`px-2 py-1 rounded ${
              status === 'approved'
                ? 'bg-green-200 text-green-800'
                : 'bg-yellow-200 text-yellow-800'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>
        <p className="mt-2">
          <span className="font-medium">Created At:</span> {formattedCreatedAt}
        </p>
        <p className="mt-2">
          <span className="font-medium">Updated At:</span> {formattedUpdatedAt}
        </p>
      </div>

      {/* Image Gallery */}
      {images && images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Images</h3>
          <Swiper spaceBetween={10} slidesPerView={1} className="mt-2">
            {images.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imgUrl}
                  alt={`${title} Image ${index + 1}`}
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
        {/* Optional: Integrate a Map Here */}
        {businessLocation.city !== 'Unknown' && businessLocation.country !== 'Unknown' && (
          <div className="mt-4">
            <MapContainer
              center={[business.location.coordinates[1], business.location.coordinates[0]]}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-64 rounded-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[business.location.coordinates[1], business.location.coordinates[0]]}>
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
