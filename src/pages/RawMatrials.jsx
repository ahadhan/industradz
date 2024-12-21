import React, { useState } from "react";
import Header from "../dashboard/components/common/Header";
import { motion } from "framer-motion";
import { Package, CheckCircle, MapPin, TrendingUp } from "lucide-react";
import StatCard from "../dashboard/components/common/StatCard";

const rawMaterials = [
  {
    id: 1,
    type: "Steel Sheets",
    form: "Sheets",
    quantity: "500 kg",
    quality: "ISO 9001 Certified",
    price: "$1,200",
    location: "Chicago, USA",
    availability: "In Stock",
    verified: true,
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 2,
    type: "Plastic Tubes",
    form: "Tubes",
    quantity: "200 m",
    quality: "High-Grade Polymer",
    price: "$800",
    location: "Munich, Germany",
    availability: "Available on Order",
    verified: false,
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 3,
    type: "Industrial Chemicals",
    form: "Liquid",
    quantity: "1,000 L",
    quality: "99% Purity",
    price: "$3,000",
    location: "Shanghai, China",
    availability: "In Stock",
    verified: true,
    image: "https://via.placeholder.com/300x180",
  },
];

const MaterialDetailsPopup = ({ material, onClose }) => {
  if (!material) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-800">{material.type}</h2>
        <img
          src={material.image}
          alt={material.type}
          className="w-full h-48 object-cover rounded-lg my-4"
        />
        <p className="text-sm text-gray-600">
          <span className="font-medium">Form:</span> {material.form}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Quantity:</span> {material.quantity}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Quality:</span> {material.quality}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Availability:</span>{" "}
          {material.availability}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Location:</span> {material.location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price:</span> {material.price}
        </p>
        {material.verified && (
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

const RawMaterials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const stats = [
    {
      name: "Total Materials",
      icon: Package,
      value: rawMaterials.length,
      color: "#F59E0B",
    },
    {
      name: "Verified Suppliers",
      icon: CheckCircle,
      value: rawMaterials.filter((m) => m.verified).length,
      color: "#10B981",
    },
    {
      name: "In Stock",
      icon: TrendingUp,
      value: rawMaterials.filter((m) => m.availability === "In Stock").length,
      color: "#3B82F6",
    },
    {
      name: "Popular Location",
      icon: MapPin,
      value: rawMaterials[0]?.location.split(",")[1]?.trim() || "N/A",
      color: "#EF4444",
    },
  ];

  return (
    <>
      <Header title={"Raw Materials"} />
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
          {rawMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <img
                src={material.image}
                alt={material.type}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">
                  {material.type}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Form:</span> {material.form}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Quantity:</span>{" "}
                  {material.quantity}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Quality:</span>{" "}
                  {material.quality}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Availability:</span>{" "}
                  {material.availability}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Location:</span>{" "}
                  {material.location}
                </p>
                {material.verified && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    Verified Supplier
                  </p>
                )}
                <div className="mt-auto">
                  <p className="text-xl text-gray-600 font-bold">
                    {material.price}
                  </p>
                  <button
                    onClick={() => setSelectedMaterial(material)}
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
      <MaterialDetailsPopup
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
    </>
  );
};

export default RawMaterials;
