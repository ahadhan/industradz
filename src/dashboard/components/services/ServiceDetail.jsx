// src/components/ServiceDetail.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { editServiceAsync, deleteServiceAsync } from '../slices/servicesSlice';
import { toast } from 'react-hot-toast';
import Loader from './Loader/Loader';
import { Rating, Typography, Divider, Box } from "@mui/material";
import { FiCheckCircle, FiSettings, FiCalendar, FiDollarSign, FiTag, FiPackage } from 'lucide-react';
import { FaLocationDot } from 'react-icons/fa6';
import Button from './Buttons/Button';

const ServiceDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const services = useSelector((state) => state.services.services);
  const { loading, error } = useSelector((state) => state.services);
  
  const [service, setService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    coverImage: "",
    bookings: "",
    revenue: "",
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const foundService = services.find((s) => s.id.toString() === id);
    if (foundService) {
      setService(foundService);
      setFormData({
        name: foundService.name,
        category: foundService.category,
        price: foundService.price,
        description: foundService.description,
        coverImage: foundService.coverImage,
        bookings: foundService.bookings,
        revenue: foundService.revenue,
      });
      // If there are additional images, set them for preview
      if (foundService.images && foundService.images.length > 0) {
        setPreviewImages(foundService.images);
      }
    } else {
      toast.error("Service not found.");
      navigate("/dashboard/services");
    }
  }, [id, services, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.description ||
      !formData.coverImage
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedService = {
      ...service,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      coverImage: formData.coverImage,
      bookings: parseInt(formData.bookings) || service.bookings,
      revenue: parseFloat(formData.revenue) || service.revenue,
    };

    dispatch(editServiceAsync(updatedService))
      .unwrap()
      .then((data) => {
        setService(data);
        setIsEditing(false);
        toast.success("Service updated successfully!");
      })
      .catch((err) => {
        toast.error(err || "Failed to update service.");
      });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      dispatch(deleteServiceAsync(service.id))
        .unwrap()
        .then(() => {
          toast.success("Service deleted successfully!");
          navigate("/dashboard/services");
        })
        .catch((err) => {
          toast.error(err || "Failed to delete service.");
        });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!service) {
    return null; // Or a fallback UI
  }

  return (
    <React.Fragment>
      <Layout>
        <motion.div
          className='py-5 px-3 sm:px-5 w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto py-4 px-2">
            {/* Main Image and Smaller Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <div className="relative aspect-[16/9] hover:scale-110 transition-transform duration-300">
                  {service.coverImage && (
                    <img
                      src={service.coverImage}
                      alt={service.name}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>
              {/* Grid of Smaller Images (if any additional images) */}
              {/* Modify based on your data structure */}
            </div>

            {/* Service Details Section */}
            <div className='mt-6 bg-white py-6 sm:px-5 px-3 rounded-lg shadow-md'>
              <div className='flex flex-wrap justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>{service.name}</h1>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? "Cancel Edit" : "Edit Service"}
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={handleDelete}
                  >
                    Delete Service
                  </button>
                </div>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Service Name"
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    <option value="Wood">Wood</option>
                    <option value="Water">Water</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Plants">Plants</option>
                    <option value="Maintenance">Maintenance</option>
                    {/* Add more categories as needed */}
                  </select>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Price"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Cover Image URL"
                  />
                  {/* Add more fields as necessary */}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Rating
                      name="read-only"
                      value={parseInt(service?.ratings) || 0}
                      readOnly
                    />
                    <Typography
                      variant="body1"
                      color="#a3a3a3"
                    >
                      (
                      {service?.ratings
                        ? parseFloat(service.ratings).toFixed(1)
                        : "0"}{" "}
                      / 5)
                    </Typography>
                  </Box>
                  <Divider />
                  <div className='mb-4 mt-4'>
                    <div className='flex items-center gap-4 justify-end'>
                      <span className="font-semibold">Category:</span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">{service.category}</span>
                    </div>
                    <p className='text-gray-700 mt-3'>
                      {service.description}
                    </p>
                  </div>
                  <Divider />
                  {/* Additional Service Details or Actions */}
                  {/* Implement the preview section here or below */}
                </>
              )}

              {/* Preview Section */}
              {!isEditing && (
                <div className='mt-6'>
                  <h3 className='text-2xl font-bold mb-4'>Service Preview</h3>
                  <div className="border p-4 rounded-lg">
                    <h4 className="text-xl font-semibold">{service.name}</h4>
                    <p className="text-gray-600">${service.price.toFixed(2)}</p>
                    <p className="text-gray-700 mt-2">{service.description}</p>
                    {previewImages.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {previewImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Preview ${index}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Layout>
      {/* Include ImageSliderModal if needed */}
      {/* {sliderImage && <ImageSliderModal />} */}
    </React.Fragment>
  );
};

export default ServiceDetail;
