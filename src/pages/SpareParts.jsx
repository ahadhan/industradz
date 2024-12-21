import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../dashboard/components/common/Header";
import { Package, CheckCircle, MapPin, TrendingUp} from "lucide-react";
import StatCard from "../dashboard/components/common/StatCard";

const spareParts = [
  {
    id: 1,
    type: "Engine",
    compatibility: "Compatible with Caterpillar Bulldozer",
    condition: "New",
    price: "$2,500",
    location: "Los Angeles, USA",
    availability: "In Stock",
    warranty: "1 Year Warranty",
    verified: true,
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 2,
    type: "Bearing",
    compatibility: "Compatible with John Deere Tractor",
    condition: "Used",
    price: "$300",
    location: "Berlin, Germany",
    availability: "Available on Order",
    warranty: "6 Months Warranty",
    verified: false,
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 3,
    type: "Filter",
    compatibility: "Compatible with Komatsu Excavator",
    condition: "New",
    price: "$150",
    location: "Tokyo, Japan",
    availability: "In Stock",
    warranty: "3 Months Warranty",
    verified: true,
    image: "https://via.placeholder.com/300x180",
  },
];

const PartDetailsPopup = ({ part, onClose }) => {
  if (!part) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-800">{part.type}</h2>
        <img
          src={part.image}
          alt={part.type}
          className="w-full h-48 object-cover rounded-lg my-4"
        />
        <p className="text-sm text-gray-600">
          <span className="font-medium">Compatibility:</span>{" "}
          {part.compatibility}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Condition:</span> {part.condition}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Availability:</span>{" "}
          {part.availability}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Location:</span> {part.location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Warranty:</span> {part.warranty}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price:</span> {part.price}
        </p>
        {part.verified && (
          <p className="text-green-600 text-sm mt-2 font-medium">
            Verified Supplier
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-orange text-white py-2 px-4 rounded-2xl transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SpareParts = () => {
  const [selectedPart, setSelectedPart] = useState(null);

  const stats = [
    {
      name: "Total Parts",
      icon: Package,
      value: spareParts.length,
      color: "#F59E0B",
    },
    {
      name: "Verified Suppliers",
      icon: CheckCircle,
      value: spareParts.filter((part) => part.verified).length,
      color: "#10B981",
    },
    {
      name: "In Stock",
      icon: TrendingUp,
      value: spareParts.filter((part) => part.availability === "In Stock")
        .length,
      color: "#3B82F6",
    },
    {
      name: "Popular Location",
      icon: MapPin,
      value: spareParts[0]?.location.split(",")[1]?.trim() || "N/A",
      color: "#EF4444",
    },
  ];

  return (
    <>
      <Header title="Spare Parts" />
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
        </motion.div>
      </div>
      <div className="p-6 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {spareParts.map((part) => (
            <div
              key={part.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <img
                src={part.image}
                alt={part.type}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">
                  {part.type}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Compatibility:</span>{" "}
                  {part.compatibility}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Condition:</span>{" "}
                  {part.condition}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Availability:</span>{" "}
                  {part.availability}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Location:</span>{" "}
                  {part.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Warranty:</span>{" "}
                  {part.warranty}
                </p>
                {part.verified && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    Verified Supplier
                  </p>
                )}
                <div className="mt-auto">
                  <p className="text-xl text-gray-600 font-bold">
                    {part.price}
                  </p>
                  <button
                    onClick={() => setSelectedPart(part)}
                    className="mt-4 w-full bg-orange text-white py-2 px-4 rounded-2xl transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PartDetailsPopup
        part={selectedPart}
        onClose={() => setSelectedPart(null)}
      />
    </>
  );
};

export default SpareParts;
