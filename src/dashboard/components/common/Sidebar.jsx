import { BarChart2, DollarSign, Menu, Bell, User, Settings, ShoppingBag, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Overview",
		icon: BarChart2,
		color: "#6366f1",
		href: "/dashboard",
	},
	{
		name: "Services",
		icon: ShoppingBag,
		color: "#4F46E5",
		href: "/dashboard/services",
		// submenu: [
		// 	{
		// 		name: "Industrials Offering",
		// 		href: "/dashboard/services/industrials-offering",
		// 	},
		// 	{
		// 		name: "Marketplace",
		// 		href: "/dashboard/services/other-marketplace",
		// 		submenu: [
		// 			{ name: "Industrial Machines", href: "/dashboard/services/marketplace/industrial-machines" },
		// 			{ name: "Raw Materials", href: "/dashboard/services/marketplace/raw-materials" },
		// 			{ name: "Spare Parts", href: "/dashboard/services/marketplace/spare-parts" },
		// 		],
		// 	},
		// ],
	},
	{ name: "Bookings", icon: ShoppingCart, color: "#F97316", href: "/dashboard/bookings" },
	{ name: "Sales", icon: DollarSign, color: "#10B981", href: "/dashboard/sales" },
	{ name: "Profile", icon: User, color: "#2563EB", href: "/dashboard/profile" },
	{ name: "Notifications", icon: Bell, color: "#F43F5E", href: "/dashboard/notifications" },
	{ name: "Settings", icon: Settings, color: "#6B7280", href: "/dashboard/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [expandedMenu, setExpandedMenu] = useState(null);
	const [expandedSubMenu, setExpandedSubMenu] = useState(null);

	const toggleMenu = (menuName) => {
		setExpandedMenu(expandedMenu === menuName ? null : menuName);
	};

	const toggleSubMenu = (subMenuName) => {
		setExpandedSubMenu(expandedSubMenu === subMenuName ? null : subMenuName);
	};

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
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
					{SIDEBAR_ITEMS.map((item) => (
						<div key={item.href}>
							<div
								className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${item.submenu ? "justify-between" : ""
									}`}
							>
								<Link to={item.href} className="flex items-center w-full">
									<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
									<AnimatePresence>
										{isSidebarOpen && (
											<motion.span
												className="ml-4 whitespace-nowrap"
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
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
										{expandedMenu === item.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
									</motion.span>
								)}
							</div>

							{/* Render Submenu */}
							<AnimatePresence>
								{item.submenu && expandedMenu === item.name && isSidebarOpen && (
									<motion.div
										className="pl-8"
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										transition={{ duration: 0.2, delay: 0.3 }}>
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
																{expandedSubMenu === subItem.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
															</motion.div>
														)}
													</motion.div>
												)}

												{/* Render Nested Submenu */}
												<AnimatePresence>
													{subItem.submenu && expandedSubMenu === subItem.name && (
														<motion.div
															className="pl-4"
															initial={{ height: "auto" }}
															animate={{ height: "auto" }}
															exit={{ height: "auto" }}
															transition={{ duration: 0.3 }}
														>
															{subItem.submenu.map((nestedSubItem) => (
																<Link key={nestedSubItem.href} to={nestedSubItem.href}>
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
