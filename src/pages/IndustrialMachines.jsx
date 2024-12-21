import Header from "../dashboard/components/common/Header";
import StatCard from "../dashboard/components/common/StatCard";
import React, { useState, useEffect } from "react";
import { TrendingUp, MapPin, Package, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import AddServiceButton from "../dashboard/components/services/AddServiceButton";
import MachineDetailsPopup from "./MachineDetailsPopup";

const baseURL = "https://industradz-backend-new.onrender.com";

const IndustrialMachines = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); 

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/machinery/allMachines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMachines(response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdded = () => {
    fetchMachines(); // Refresh machine list when a new service is added
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const stats = [
    {
      name: "Total Machines",
      icon: Package,
      value: machines.length,
      color: "#F59E0B",
    },
    {
      name: "Average Price",
      icon: DollarSign,
      value: `$${Math.round(
        machines.reduce((acc, m) => acc + parseInt(m.price.replace(/[^0-9]/g, "")), 0) /
          machines.length || 0
      )}`,
      color: "#10B981",
    },
    {
      name: "New Machines",
      icon: TrendingUp,
      value: machines.filter((m) => m.condition === "New").length,
      color: "#3B82F6",
    },
    {
      name: "Popular Location",
      icon: MapPin,
      value: machines[0]?.location.split(",")[1]?.trim() || "N/A",
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
            <div className="loader">
              <div className="justify-content-center jimu-primary-loading"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <div
                key={machine.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={machine.image}
                  alt={machine.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{machine.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Condition:</span> {machine.condition}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Brand:</span> {machine.brand}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Location:</span> {machine.location}
                  </p>
                  <div className="mt-4">
                    <p className="text-xl text-gray-500 font-bold">{machine.price}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMachine(machine)}
                    className="mt-4 w-full bg-orange text-white py-2 px-4 rounded-2xl transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
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
