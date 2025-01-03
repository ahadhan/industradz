// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BarChart2, DollarSign, Menu, Bell, User, Settings, ShoppingBag, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const SIDEBAR_ITEMS = [
// 	{
// 		name: "Overview",
// 		icon: BarChart2,
// 		color: "#6366f1",
// 		href: "/dashboard",
// 	},
// 	{
// 		name: "Services",
// 		icon: ShoppingBag,
// 		color: "#4F46E5",
// 		href: "/dashboard/services",
// 		submenu: [
// 			{
// 				name: "Industrials Offering",
// 				href: "/dashboard/services/industrials-offering",
// 			},
// 			{
// 				name: "Marketplace",
// 				href: "/dashboard/services/other-marketplace",
// 				submenu: [
// 					{ name: "Industrial Machines", href: "/dashboard/services/marketplace/industrial-machines" },
// 					{ name: "Raw Materials", href: "/dashboard/services/marketplace/raw-materials" },
// 					{ name: "Spare Parts", href: "/dashboard/services/marketplace/spare-parts" },
// 				],
// 			},
// 		],
// 	},
// 	{ name: "Bookings", icon: ShoppingCart, color: "#F97316", href: "/dashboard/bookings" },
// 	{ name: "Sales", icon: DollarSign, color: "#10B981", href: "/dashboard/sales" },
// 	{ name: "Profile", icon: User, color: "#2563EB", href: "/dashboard/profile" },
// 	{ name: "Notifications", icon: Bell, color: "#F43F5E", href: "/dashboard/notifications" },
// 	{ name: "Settings", icon: Settings, color: "#6B7280", href: "/dashboard/settings" },
// ];

// const Sidebar = () => {

// 	const [filteredSidebar, setFilteredSidebar] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Define your API endpoints
//     const APIs = {
//       industrialOffering: '/api/industrial-offering',
//       industrialMachines: '/api/marketplace/industrial-machines',
//       spareParts: '/api/marketplace/spare-parts',
//       rawMaterials: '/api/marketplace/raw-materials',
//     };

//     const fetchData = async () => {
//       try {
//         // Fetch Industrial Offering and Marketplace Sub-sections in parallel
//         const [
//           industrialOfferingRes,
//           industrialMachinesRes,
//           sparePartsRes,
//           rawMaterialsRes,
//         ] = await Promise.all([
//           axios.get(APIs.industrialOffering),
//           axios.get(APIs.industrialMachines),
//           axios.get(APIs.spareParts),
//           axios.get(APIs.rawMaterials),
//         ]);

//         // Determine the availability of each section/sub-section
//         const hasIndustrialOffering = industrialOfferingRes.data.length > 0;
//         const hasIndustrialMachines = industrialMachinesRes.data.length > 0;
//         const hasSpareParts = sparePartsRes.data.length > 0;
//         const hasRawMaterials = rawMaterialsRes.data.length > 0;

//         // Determine if Marketplace has any available sub-sections
//         const hasMarketplace =
//           hasIndustrialMachines || hasSpareParts || hasRawMaterials;

//         // Clone SIDEBAR_ITEMS to avoid mutating the original
//         let updatedSidebar = JSON.parse(JSON.stringify(SIDEBAR_ITEMS));

//         // Find the "Services" section
//         const servicesSection = updatedSidebar.find(
//           (item) => item.name === 'Services'
//         );

//         if (servicesSection) {
//           // Filter "Industrial Offering"
//           if (!hasIndustrialOffering) {
//             servicesSection.submenu = servicesSection.submenu.filter(
//               (sub) => sub.name !== 'Industrial Offering'
//             );
//           }

//           // Handle "Marketplace" based on sub-sections
//           const marketplaceSubmenu = servicesSection.submenu.find(
//             (sub) => sub.name === 'Marketplace'
//           );

//           if (marketplaceSubmenu) {
//             if (hasMarketplace) {
//               // Filter Marketplace's sub-submenus based on availability
//               marketplaceSubmenu.submenu = marketplaceSubmenu.submenu.filter(
//                 (sub) => {
//                   if (sub.name === 'Industrial Machines')
//                     return hasIndustrialMachines;
//                   if (sub.name === 'Spare Parts') return hasSpareParts;
//                   if (sub.name === 'Raw Materials') return hasRawMaterials;
//                   return false;
//                 }
//               );
//             } else {
//               // If no Marketplace sub-sections have items, remove Marketplace
//               servicesSection.submenu = servicesSection.submenu.filter(
//                 (sub) => sub.name !== 'Marketplace'
//               );
//             }
//           }

//           // If "Services" has no submenus left, remove it
//           if (servicesSection.submenu.length === 0) {
//             updatedSidebar = updatedSidebar.filter(
//               (item) => item.name !== 'Services'
//             );
//           }
//         }

//         setFilteredSidebar(updatedSidebar);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching sidebar data:', err);
//         setError('Failed to load sidebar data.');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);


// 	if (loading) {
// 	  return (
// 		<div className="sidebar">
// 		  <p>Loading...</p>
// 		</div>
// 	  );
// 	}

// 	if (error) {
// 	  return (
// 		<div className="sidebar">
// 		  <p>{error}</p>
// 		</div>
// 	  );
// 	}


// 	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// 	const [expandedMenu, setExpandedMenu] = useState(null);
// 	const [expandedSubMenu, setExpandedSubMenu] = useState(null);

// 	const toggleMenu = (menuName) => {
// 		setExpandedMenu(expandedMenu === menuName ? null : menuName);
// 	};

// 	const toggleSubMenu = (subMenuName) => {
// 		setExpandedSubMenu(expandedSubMenu === subMenuName ? null : subMenuName);
// 	};

// 	return (
// 		<motion.div
// 			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
// 				}`}
// 			animate={{ width: isSidebarOpen ? 256 : 80 }}
// 		>
// 			<div className="h-full backdrop-blur-md p-4 flex flex-col border-r">
// 				<motion.button
// 					whileHover={{ scale: 1.1 }}
// 					whileTap={{ scale: 0.9 }}
// 					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// 					className="p-2 rounded-full transition-colors max-w-fit"
// 				>
// 					<Menu size={24} />
// 				</motion.button>

// 				<nav className="mt-8 flex-grow">
// 					{SIDEBAR_ITEMS.map((item) => (
// 						<div key={item.href}>
// 							<div
// 								className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${item.submenu ? "justify-between" : ""
// 									}`}
// 							>
// 								<Link to={item.href} className="flex items-center w-full">
// 									<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
// 									<AnimatePresence>
// 										{isSidebarOpen && (
// 											<motion.span
// 												className="ml-4 whitespace-nowrap"
// 												initial={{ opacity: 0, width: 0 }}
// 												animate={{ opacity: 1, width: "auto" }}
// 												exit={{ opacity: 0, width: 0 }}
// 												transition={{ duration: 0.2, delay: 0.3 }}
// 											>
// 												{item.name}
// 											</motion.span>
// 										)}
// 									</AnimatePresence>
// 								</Link>

// 								{item.submenu && isSidebarOpen && (
// 									<motion.span
// 										className="ml-4 cursor-pointer whitespace-nowrap"
// 										onClick={(e) => {
// 											e.preventDefault();
// 											toggleMenu(item.name);
// 										}}
// 									>
// 										{expandedMenu === item.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
// 									</motion.span>
// 								)}
// 							</div>

// 							{/* Render Submenu */}
// 							<AnimatePresence>
// 								{item.submenu && expandedMenu === item.name && isSidebarOpen && (
// 									<motion.div
// 										className="pl-8"
// 										initial={{ opacity: 0, width: 0 }}
// 										animate={{ opacity: 1, width: "auto" }}
// 										exit={{ opacity: 0, width: 0 }}
// 										transition={{ duration: 0.2, delay: 0.3 }}>
// 										{item.submenu.map((subItem) => (
// 											<div key={subItem.href}>
// 												{!subItem.submenu ? (
// 													<Link to={subItem.href}>
// 														<motion.div className="py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
// 															{subItem.name}
// 														</motion.div>
// 													</Link>
// 												) : (
// 													<motion.div
// 														className="py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer flex items-center"
// 														onClick={() => toggleSubMenu(subItem.name)}
// 													>
// 														{subItem.name}
// 														{isSidebarOpen && (
// 															<motion.div className="ml-4 whitespace-nowrap">
// 																{expandedSubMenu === subItem.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
// 															</motion.div>
// 														)}
// 													</motion.div>
// 												)}

// 												{/* Render Nested Submenu */}
// 												<AnimatePresence>
// 													{subItem.submenu && expandedSubMenu === subItem.name && (
// 														<motion.div
// 															className="pl-4"
// 															initial={{ height: "auto" }}
// 															animate={{ height: "auto" }}
// 															exit={{ height: "auto" }}
// 															transition={{ duration: 0.3 }}
// 														>
// 															{subItem.submenu.map((nestedSubItem) => (
// 																<Link key={nestedSubItem.href} to={nestedSubItem.href}>
// 																	<motion.div className="py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
// 																		{nestedSubItem.name}
// 																	</motion.div>
// 																</Link>
// 															))}
// 														</motion.div>
// 													)}
// 												</AnimatePresence>
// 											</div>
// 										))}
// 									</motion.div>
// 								)}
// 							</AnimatePresence>

// 						</div>
// 					))}
// 				</nav>
// 			</div>
// 		</motion.div>
// 	);
// };

// export default Sidebar;







// Sidebar.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
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
import { Oval } from "react-loader-spinner";
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

// ... SIDEBAR_ITEMS definition remains the same

const SIDEBAR_ITEMS = [
  {
    name: 'Overview',
    icon: BarChart2,
    color: '#6366f1',
    href: '/dashboard',
  },
  {
    name: 'Services',
    icon: ShoppingBag,
    color: '#4F46E5',
    href: '/dashboard/services',
    submenu: [
      {
        name: 'Industrials Offering',
        href: '/dashboard/services/industrials-offering',
      },
      {
        name: 'Marketplace',
        href: '/dashboard/services/other-marketplace',
        submenu: [
          {
            name: 'Industrial Machines',
            href: '/dashboard/services/marketplace/industrial-machines',
          },
          {
            name: 'Raw Materials',
            href: '/dashboard/services/marketplace/raw-materials',
          },
          {
            name: 'Spare Parts',
            href: '/dashboard/services/marketplace/spare-parts',
          },
        ],
      },
    ],
  },
  {
    name: 'Bookings',
    icon: ShoppingCart,
    color: '#F97316',
    href: '/dashboard/bookings',
  },
  {
    name: 'Sales',
    icon: DollarSign,
    color: '#10B981',
    href: '/dashboard/sales',
  },
  {
    name: 'Profile',
    icon: User,
    color: '#2563EB',
    href: '/dashboard/profile',
  },
  {
    name: 'Notifications',
    icon: Bell,
    color: '#F43F5E',
    href: '/dashboard/notifications',
  },
  {
    name: 'Settings',
    icon: Settings,
    color: '#6B7280',
    href: '/dashboard/settings',
  },
];

const deepCloneSidebarItems = (items) => {
  return items.map(item => {
    const newItem = { ...item };
    if (item.submenu) {
      newItem.submenu = deepCloneSidebarItems(item.submenu);
    }
    return newItem;
  });
};

const Sidebar = () => {
  // Initialize react-cookie
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const [filteredSidebar, setFilteredSidebar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);

  const location = useLocation();
  const token = cookies.token

  useEffect(() => {


    const APIs = {
      industrialOffering: 'https://industradz-backend-new.onrender.com/api/service/allServices',
      industrialMachines: 'https://industradz-backend-new.onrender.com/api/machinery/allMachines',
      spareParts: 'https://industradz-backend-new.onrender.com/api/spare-parts/allSpareParts',
      rawMaterials: 'https://industradz-backend-new.onrender.com/api/raw-material/allRawMaterial',
    };

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
        console.log(industrialOfferingRes)
        const hasIndustrialOffering = industrialOfferingRes.data.data.length > 0;
        const hasIndustrialMachines = industrialMachinesRes.data.data.length > 0;
        const hasSpareParts = sparePartsRes.data.data.length > 0;
        const hasRawMaterials = rawMaterialsRes.data.data.length > 0;

        console.log("Industrial offering:", hasIndustrialMachines)
        const hasMarketplace =
          hasIndustrialMachines || hasSpareParts || hasRawMaterials;

          let updatedSidebar = deepCloneSidebarItems(SIDEBAR_ITEMS);

        const servicesSection = updatedSidebar.find(
          (item) => item.name === 'Services'
        );

        if (servicesSection) {
          if (!hasIndustrialOffering) {
            servicesSection.submenu = servicesSection.submenu.filter(
              (sub) => sub.name !== 'Industrials Offering'
            );
          }

          const marketplaceSubmenu = servicesSection.submenu.find(
            (sub) => sub.name === 'Marketplace'
          );

          if (marketplaceSubmenu) {
            if (hasMarketplace) {
              marketplaceSubmenu.submenu = marketplaceSubmenu.submenu.filter(
                (sub) => {
                  if (sub.name === 'Industrial Machines')
                    return hasIndustrialMachines;
                  if (sub.name === 'Spare Parts') return hasSpareParts;
                  if (sub.name === 'Raw Materials') return hasRawMaterials;
                  return false;
                }
              );
            } else {
              servicesSection.submenu = servicesSection.submenu.filter(
                (sub) => sub.name !== 'Marketplace'
              );
            }
          }

          if (servicesSection.submenu.length === 0) {
            updatedSidebar = updatedSidebar.filter(
              (item) => item.name !== 'Services'
            );
          }
        }

        setFilteredSidebar(updatedSidebar);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
        setError(err.message || 'Failed to load sidebar data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="sidebar flex items-center justify-center h-full">
        <Oval
          height={50}
          width={50}
          color="#FF8806"
          ariaLabel="loading"
          secondaryColor="#c0c0c0"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }
  

  if (error) {
    return (
      <div className="sidebar">
        <p>{error}</p>
      </div>
    );
  }

  const toggleMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const toggleSubMenu = (subMenuName) => {
    setExpandedSubMenu(expandedSubMenu === subMenuName ? null : subMenuName);
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full backdrop-blur-md p-4 flex flex-col border-r">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {filteredSidebar.map((item) => (
            <div key={item.href}>
              <div
                className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${item.submenu ? 'justify-between' : ''
                  }`}
              >
                <Link to={item.href} className="flex items-center w-full">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: '20px' }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {item.submenu && isSidebarOpen && (
                  <motion.span
                    className="ml-4 cursor-pointer whitespace-nowrap"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(item.name);
                    }}
                  >
                    {expandedMenu === item.name ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </motion.span>
                )}
              </div>

              {/* Render Submenu */}
              <AnimatePresence>
                {item.submenu &&
                  expandedMenu === item.name &&
                  isSidebarOpen && (
                    <motion.div
                      className="pl-8"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.submenu.map((subItem) => (
                        <div key={subItem.href}>
                          {!subItem.submenu ? (
                            <Link to={subItem.href}>
                              <motion.div className="py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                                {subItem.name}
                              </motion.div>
                            </Link>
                          ) : (
                            <motion.div
                              className="py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer flex items-center"
                              onClick={() => toggleSubMenu(subItem.name)}
                            >
                              {subItem.name}
                              {isSidebarOpen && (
                                <motion.div className="ml-4 whitespace-nowrap">
                                  {expandedSubMenu === subItem.name ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </motion.div>
                              )}
                            </motion.div>
                          )}

                          {/* Render Nested Submenu */}
                          <AnimatePresence>
                            {subItem.submenu &&
                              expandedSubMenu === subItem.name && (
                                <motion.div
                                  className="pl-4"
                                  initial={{ height: 'auto' }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 'auto' }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {subItem.submenu.map((nestedSubItem) => (
                                    <Link
                                      key={nestedSubItem.href}
                                      to={nestedSubItem.href}
                                    >
                                      <motion.div className="py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
                                        {nestedSubItem.name}
                                      </motion.div>
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
