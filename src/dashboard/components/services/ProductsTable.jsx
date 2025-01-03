// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import AddServiceButton from "./AddServiceButton";
// import { useSelector, useDispatch } from "react-redux";
// import { openModal, closeModal } from "../../../slices/modalSlice";

// const ProductsTable = () => {
//   const [services, setServices] = useState([]); // State to hold added services
//   const isModalOpen = useSelector((state) => state.modal.isModalOpen);
//   const dispatch = useDispatch();
//   // Handler to add a service
//   const handleAddService = (newService) => {
//     setServices((prevServices) => [...prevServices, newService]);
//   };

//   return (
//     <motion.div
//       className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <div className={`flex justify-between items-center mb-6 ${isModalOpen ? "flex-col" : "flex-row"} `}>
//         <h2 className="text-xl font-semibold">My Services</h2>
//         <AddServiceButton onAddService={handleAddService} />
//       </div>

//       {services.length === 0 ? (
//         <p className="text-center text-gray-500">No services added yet. Add a service to see it here.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {services.map((service, index) => (
//             <motion.div
//               key={index}
//               className="bg-orange text-white overflow-hidden shadow-lg rounded-xl border border-gray-700"
//               whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
//             >
//               <div className="px-4 py-5 sm:p-6 flex flex-col">
//                 <span className="text-sm font-medium mb-4">{service.title}</span>
//                 <Link
//                   to={`/dashboard/services/${service.id}`}
//                   className="text-sm py-1 text-right px-2 bg-white text-orange font-bold rounded transition-colors duration-200 hover:bg-gray-100"
//                 >
//                   View Details
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default ProductsTable;


// ProductsTable.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddServiceButton from "./AddServiceButton";
import { useSelector } from "react-redux";
import axios from "axios";
import { Oval } from "react-loader-spinner"; // Importing the Oval spinner
import {
  BarChart2,
  DollarSign,
  Menu,
  Bell,
  User,
  Settings,
  ShoppingBag,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useCookies } from 'react-cookie';

const APIs = {
  industrialOffering: 'https://industradz-backend-new.onrender.com/api/service/allServices',
  industrialMachines: 'https://industradz-backend-new.onrender.com/api/machinery/allMachines',
  spareParts: 'https://industradz-backend-new.onrender.com/api/spare-parts/allSpareParts',
  rawMaterials: 'https://industradz-backend-new.onrender.com/api/raw-material/allRawMaterial',
};

// **Deep Clone Function (if needed)**
const deepCloneSidebarItems = (items) => {
  return items.map(item => {
    const newItem = { ...item };
    if (item.submenu) {
      newItem.submenu = deepCloneSidebarItems(item.submenu);
    }
    return newItem;
  });
};

const ProductsTable = () => {
  const [serviceAvailability, setServiceAvailability] = useState({
    hasIndustrialOffering: false,
    hasMarketplace: false,
    hasIndustrialMachines: false,
    hasSpareParts: false,
    hasRawMaterials: false,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  const isModalOpen = useSelector((state) => state.modal.isModalOpen);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  
  // Handler to add a service
  const handleAddService = (newService) => {
    if (newService && newService.id && newService.name) {
      // Optionally, you can update the service availability based on the new service
      // For simplicity, we'll just log it here
      console.log("New Service Added:", newService);
      // Implement adding logic as per your requirement
    } else {
      console.error("Invalid service object:", newService);
      setError("Failed to add service. Please try again.");
    }
  };

  const token = cookies.token

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          industrialOfferingRes,
          industrialMachinesRes,
          sparePartsRes,
          rawMaterialsRes,
        ] = await Promise.all([
          axios.get(APIs.industrialOffering, config),
          axios.get(APIs.industrialMachines, config),
          axios.get(APIs.spareParts, config),
          axios.get(APIs.rawMaterials, config),
        ]);

        // Determine availability
        const hasIndustrialOffering = industrialOfferingRes.data.data.length > 0;
        const hasIndustrialMachines = industrialMachinesRes.data.data.length > 0;
        const hasSpareParts = sparePartsRes.data.data.length > 0;
        const hasRawMaterials = rawMaterialsRes.data.data.length > 0;

        const hasMarketplace = hasIndustrialMachines || hasSpareParts || hasRawMaterials;

        setServiceAvailability({
          hasIndustrialOffering,
          hasMarketplace,
          hasIndustrialMachines,
          hasSpareParts,
          hasRawMaterials,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching services data:', err);
        setError(err.message || 'Failed to load services data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Re-run if token changes

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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <Oval
            height={50}
            width={50}
            color="#FF8806" // Primary color
            ariaLabel="Loading services"
            secondaryColor="#c0c0c0" // Secondary color
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-32">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Services Tabs */}
      {!loading && !error && !isModalOpen && (
        <div className="flex flex-col">
          <div className="flex space-x-4 mb-6">
            {/* Industrial Offering Tab */}
            {serviceAvailability.hasIndustrialOffering && (
              <Link to="/dashboard/services/industrials-offering">
                <button className="px-4 py-2 bg-orange text-white rounded-xl hover:scale-105 transition duration-300">
                  Industrial Offering
                </button>
              </Link>
            )}

            {/* Marketplace Tab */}
            {serviceAvailability.hasMarketplace && (
              <div className="relative group">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:scale-105 transition duration-300">
                  Marketplace
                </button>

                {/* Sub-Tabs */}
                <div className="absolute left-0 mt-2 w-100 bg-indigo-500 border text-white border-indigo-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <ul>
                    {serviceAvailability.hasIndustrialMachines && (
                      <li>
                        <Link to="/dashboard/services/marketplace/industrial-machines">
                          <button className="w-full text-left px-4 py-2  border-xl transition-colors">
                            Industrial Machines
                          </button>
                        </Link>
                      </li>
                    )}
                    {serviceAvailability.hasSpareParts && (
                      <li>
                        <Link to="/dashboard/services/marketplace/spare-parts">
                        <button className="w-full text-left px-4 py-2  border-xl transition-colors">
                            Spare Parts
                          </button>
                        </Link>
                      </li>
                    )}
                    {serviceAvailability.hasRawMaterials && (
                      <li>
                        <Link to="/dashboard/services/marketplace/raw-materials">
                        <button className="w-full text-left px-4 py-2  border-xl transition-colors">
                            Raw Materials
                          </button>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Optionally, you can display more content here */}
          {/* For example, a description or statistics */}
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;
