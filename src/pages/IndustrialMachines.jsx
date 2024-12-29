// IndustrialMachines.jsx
import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { TrendingUp, MapPin, Package, DollarSign, EllipsisVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast'; // Import react-hot-toast

import Header from "../dashboard/components/common/Header";
import StatCard from "../dashboard/components/common/StatCard";
import AddServiceButton from "../dashboard/components/services/AddServiceButton";
import MachineDetailsPopup from "./MachineDetailsPopup";
import { Oval } from 'react-loader-spinner'; // Import loader component
import { useNavigate } from "react-router-dom";

const baseURL = "https://industradz-backend-new.onrender.com";

const IndustrialMachines = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [cookies] = useCookies(['token']);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = (id) => {
    setDropdownOpen(prevId => (prevId === id ? null : id));
  };

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const token = cookies.token;

      if (!token) {
        throw new Error("No authentication token found in cookies");
      }

      const response = await axios.get(`${baseURL}/api/machinery/allMachines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        setMachines(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setMachines([]);
        toast.error("Failed to fetch machines. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching machines:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired or unauthorized. Please log in again.");
        } else {
          toast.error(error.response.data.message || "Failed to fetch machines.");
        }
      } else {
        toast.error("An error occurred. Please check your network.");
      }

      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdded = () => {
    fetchMachines();
  };

  const handleViewDetails = (machineId) => {
    setLoading(true);
    navigate(`/dashboard/services/marketplace/industrial-machines/${machineId}`); // Navigate to the details route
    setLoading(false);
  };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col">
          <span>Are you sure you want to delete this machine?</span>
          <div className="mt-2 flex justify-end">
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${baseURL}/api/machinery/deleteMachine/${id}`, {
                    headers: {
                      Authorization: `Bearer ${cookies.token}`,
                    },
                  });

                  setMachines(prevMachines => prevMachines.filter(machine => machine._id !== id));
                  toast.success("Machine deleted successfully.");
                  toast.dismiss(t.id);
                } catch (error) {
                  console.error("Error deleting machine:", error);
                  toast.error("Failed to delete the machine. Please try again.");
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
    fetchMachines();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
      name: "Total Machines",
      icon: Package,
      value: Array.isArray(machines) ? machines.length : 0,
      color: "#F59E0B",
    },
    {
      name: "Average Price",
      icon: DollarSign,
      value: Array.isArray(machines) && machines.length > 0
        ? `$${Math.round(
            machines.reduce((acc, m) => acc + m.price, 0) / machines.length
          )}`
        : "$0",
      color: "#10B981",
    },
    {
      name: "New Machines",
      icon: TrendingUp,
      value: Array.isArray(machines) ? machines.filter((m) => m.condition === "New").length : 0,
      color: "#3B82F6",
    },
    {
      name: "Popular Location",
      icon: MapPin,
      value: Array.isArray(machines) && machines.length > 0
        ? `${machines[0].location_city}, ${machines[0].location_country}`
        : "N/A",
      color: "#EF4444",
    },
  ];

  return (
    <>
      <Header title={"Industrial Machines"} />

      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
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
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.isArray(machines) && machines.length > 0 ? (
              machines.map((machine) => (
                <div
                  key={machine._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                >
                  <img
                    src={machine.machine_images[0]}
                    alt={machine.machine_name || "Unnamed Machine"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">{machine.machine_name || "Unnamed Machine"}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Condition:</span> {machine.condition || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Brand:</span> {machine.brand || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Location:</span> {machine.location_city || "N/A"}, {machine.location_country || "N/A"}
                    </p>
                    <div className="mt-4">
                      <p className="text-xl text-gray-500 font-bold">{`${machine.currency || "$"} ${machine.price || "0"}`}</p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(machine._id)}
                      className="mt-4  bg-orange text-white py-2 px-4 rounded-2xl transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>

                  <button
                    aria-label="Options"
                    className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(machine._id);
                    }}
                  >
                    <EllipsisVertical size={20} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen === machine._id && (
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
                            setSelectedMachine(machine);
                            setDropdownOpen(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(machine._id)}
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
              <p className="text-center text-gray-500">No machines available.</p>
            )}
          </div>
        )}
      </div>

      <MachineDetailsPopup
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
      />
    </>
  );
};

export default IndustrialMachines;
