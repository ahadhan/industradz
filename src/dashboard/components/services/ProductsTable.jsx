import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddServiceButton from "./AddServiceButton";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../../slices/modalSlice";

const ProductsTable = () => {
  const [services, setServices] = useState([]); // State to hold added services
  const isModalOpen = useSelector((state) => state.modal.isModalOpen);
  const dispatch = useDispatch();
  // Handler to add a service
  const handleAddService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className={`flex justify-between items-center mb-6 ${isModalOpen ? "flex-col" : "flex-row"} `}>
        <h2 className="text-xl font-semibold">My Services</h2>
        <AddServiceButton onAddService={handleAddService} />
      </div>

      {services.length === 0 ? (
        <p className="text-center text-gray-500">No services added yet. Add a service to see it here.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-orange text-white overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            >
              <div className="px-4 py-5 sm:p-6 flex flex-col">
                <span className="text-sm font-medium mb-4">{service.title}</span>
                <Link
                  to={`/dashboard/services/${service.id}`}
                  className="text-sm py-1 text-right px-2 bg-white text-orange font-bold rounded transition-colors duration-200 hover:bg-gray-100"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;
