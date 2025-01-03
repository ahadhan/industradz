// IndustrialOfferings.jsx

import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Settings,
  DollarSign,
  ShoppingBag,
  BarChart2,
  TrendingUp,
  MapPin,
  Package,
  EllipsisVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

import Header from "../dashboard/components/common/Header";
import StatCard from "../dashboard/components/common/StatCard";
import ServiceBox from "../dashboard/components/services/ServiceBox";
import AddServiceButton from "../dashboard/components/services/AddServiceButton";
// import ServiceDetailsPopup from "./ServiceDetailsPopup"; // Assuming you have a ServiceDetailsPopup component

const baseURL = "https://industradz-backend-new.onrender.com";

const IndustrialOfferings = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [cookies] = useCookies(["token"]);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = (id) => {
    setDropdownOpen((prevId) => (prevId === id ? null : id));
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = cookies.token;

      if (!token) {
        throw new Error("No authentication token found in cookies");
      }

      const response = await axios.get(`${baseURL}/api/service/allServices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data)
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setServices([]);
        toast.error("Failed to fetch services. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching services:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error(
            "Session expired or unauthorized. Please log in again."
          );
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch services."
          );
        }
      } else {
        toast.error("An error occurred. Please check your network.");
      }

      // setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdded = () => {
    fetchServices();
  };

  const handleViewDetails = (serviceId) => {
    setLoading(true);
    navigate(`/dashboard/services/industrial-offering/${serviceId}`); // Update the route as needed
    setLoading(false);
  };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col">
          <span>Are you sure you want to delete this service?</span>
          <div className="mt-2 flex justify-end">
            <button
              onClick={async () => {
                try {
                  await axios.delete(
                    `${baseURL}/api/service/deleteService/${id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${cookies.token}`,
                      },
                    }
                  );

                  setServices((prevServices) =>
                    prevServices.filter((service) => service._id !== id)
                  );
                  toast.success("Service deleted successfully.");
                  toast.dismiss(t.id);
                } catch (error) {
                  console.error("Error deleting service:", error);
                  toast.error(
                    "Failed to delete the service. Please try again."
                  );
                }
              }}
              className="mr-2 px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const stats = [
    {
      name: "Total Services",
      icon: Package,
      value: Array.isArray(services) ? services.length : 0,
      color: "#F59E0B",
    },
    {
      name: "Average Price",
      icon: DollarSign,
      value: (() => {
        if (Array.isArray(services) && services.length > 0) {
          // Filter out services without a valid price
          const validServices = services.filter(service => {
            const price = Number(service.price);
            return !isNaN(price);
          });

          if (validServices.length === 0) {
            return "$0";
          }

          // Calculate the total price
          const totalPrice = validServices.reduce((acc, service) => acc + Number(service.price), 0);

          // Calculate the average price
          const averagePrice = Math.round(totalPrice / validServices.length);

          return `$${averagePrice}`;
        }
        return "$0";
      })(),
      color: "#10B981",
    },
    {
      name: "New Services",
      icon: TrendingUp,
      value: Array.isArray(services)
        ? services.filter((s) => s.status === "New").length
        : 0,
      color: "#3B82F6",
    },
    {
      name: "Popular Location",
      icon: MapPin,
      value:
        Array.isArray(services) && services.length > 0
          ? `${services[0].location_city}, ${services[0].location_country}`
          : "N/A",
      color: "#EF4444",
    },
  ];

  return (
    <>
      <Header title={"Industrial Offerings"} />

      <div className=" mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              name={stat.name}
              icon={stat.icon}
              value={stat.value}
              color={stat.color}
            />
          ))}
          <AddServiceButton onServiceAdded={handleServiceAdded} />
        </motion.div>
      </div>

      <div className="p-6 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Oval
              height={80}
              width={80}
              color="#FF8806"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.length > 0 && Array.isArray(services) ? (
              services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                >
                  {service.images &&
                    <img
                      src={service.images[0]}
                      alt={service.title || "Unnamed Service"}
                      className="w-full h-48 object-cover"
                    />
                  }
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {service.title || "Unnamed Service"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Category:</span>{" "}
                      {service.category || "N/A"}
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-lg text-gray-500 font-bold">
                        {`${service.pricing.unit || ""} ${service.pricing.amount || "0"
                          }`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(service._id)}
                      className="mt-4 bg-orange text-white py-2 px-4 rounded-2xl transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>

                  <button
                    aria-label="Options"
                    className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(service._id);
                    }}
                  >
                    <EllipsisVertical size={20} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen === service._id && (
                      <motion.div
                        ref={dropdownRef}
                        className="absolute bottom-12 right-4 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setDropdownOpen(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No services available.</p>
            )}
          </div>
        )}
      </div>

      {/* Assuming you have a ServiceDetailsPopup component */}
      {/* <ServiceDetailsPopup
        service={selectedService}
        onClose={() => setSelectedService(null)}
      /> */}
    </>
  );
};

export default IndustrialOfferings;
