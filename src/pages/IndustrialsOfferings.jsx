import React from "react";
import { motion } from "framer-motion";
import { Settings, DollarSign, ShoppingBag, BarChart2 } from "lucide-react"; // Add appropriate icons
import StatCard from "../dashboard/components/common/StatCard"; // Assuming StatCard is in the same directory or adjust the import
import ServiceBox from "../dashboard/components/services/ServiceBox";
import Header from '../dashboard/components/common/Header'

const INDUSTRIAL_OFFERINGS = [
  {
    name: "Industrial Machines",
    icon: Settings,
    value: "0",
    color: "#4F46E5", // Indigo color
  },
  {
    name: "Agricultural Equipment",
    icon: DollarSign,
    value: "0",
    color: "#10B981", // Green color
  },
  {
    name: "Construction Machinery",
    icon: ShoppingBag,
    value: "0",
    color: "#F97316", // Orange color
  },
  {
    name: "Production Equipment",
    icon: BarChart2,
    value: "0",
    color: "#6366F1", // Light Indigo color
  }
];


const IndustrialOfferings = () => {
  return (
    <div >
      <Header title="Industrial Offerings" />

      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
      </motion.h1>
      <div className="p-9">

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {INDUSTRIAL_OFFERINGS.map((item) => (
            <StatCard
              key={item.name}
              name={item.name}
              icon={item.icon}
              value={item.value}
              color={item.color}
            />
          ))}
        </motion.div>
        <ServiceBox />
      </div>
    </div>
  );
};

export default IndustrialOfferings;
 