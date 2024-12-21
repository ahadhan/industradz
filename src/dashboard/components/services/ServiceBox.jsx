import React, { useState, useEffect } from "react";
import { Trash2, Edit, Search } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import { motion } from "framer-motion";
import AddServiceButton from "./AddServiceButton";

const ServiceBox = () => {

    
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredServices, setFilteredServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceTypeModal, setServiceTypeModal] = useState(false);
    const [newService, setNewService] = useState({
        id: null,
        name: "",
        category: "",
        price: "",
        bookings: "",
        revenue: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // Fetch services on component mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch("/api/service/allServices");
            const data = await response.json();
            setFilteredServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = filteredServices.filter(
            (service) =>
                service.name.toLowerCase().includes(term) ||
                service.category.toLowerCase().includes(term)
        );
        setFilteredServices(filtered);
    };

    const handleDeleteConfirmation = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteService = async () => {
        try {
            await fetch(`/api/service/${serviceToDelete.id}`, {
                method: "DELETE",
            });
            setFilteredServices((prev) =>
                prev.filter((service) => service.id !== serviceToDelete.id)
            );
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const handleAddService = () => {
        setSearchTerm(""); // Clear search term to ensure all services show
        setNewService({
            id: null,
            name: "",
            category: "",
            price: "",
            bookings: "",
            revenue: "",
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleSaveService = async () => {
        const endpoint = isEditing
            ? `/api/service/${newService.id}`
            : "/api/service/addService";
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newService),
            });

            if (!response.ok) {
                throw new Error("Failed to save service");
            }

            const savedService = await response.json();

            setFilteredServices((prev) =>
                isEditing
                    ? prev.map((service) =>
                          service.id === savedService.id ? savedService : service
                      )
                    : [...prev, savedService]
            );

            setIsModalOpen(false);
            setIsEditing(false);
            setNewService({
                id: null,
                name: "",
                category: "",
                price: "",
                bookings: "",
                revenue: "",
            });
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    const handleEditService = (service) => {
        setNewService(service);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 mt-6 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700">
            {/* Header */}
            <motion.div
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl font-semibold">My Services</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        className="border rounded-2xl px-4 py-2"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <AddServiceButton onClick={handleAddService} />
                </div>
            </motion.div>

            {/* Service Table */}
            <motion.div
                className="overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <table className="min-w-full bg-white border-collapse border border-gray-200 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Category</th>
                            <th className="text-left px-4 py-2">Price</th>
                            <th className="text-left px-4 py-2">Bookings</th>
                            <th className="text-left px-4 py-2">Revenue</th>
                            <th className="text-center px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service) => (
                            <motion.tr
                                key={service.id}
                                className="border-b hover:bg-gray-50 transition"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-4 py-2">{service.name}</td>
                                <td className="px-4 py-2">{service.category}</td>
                                <td className="px-4 py-2">${service.price.toFixed(2)}</td>
                                <td className="px-4 py-2">{service.bookings}</td>
                                <td className="px-4 py-2">${service.revenue.toLocaleString()}</td>
                                <td className="px-4 py-2 flex justify-center gap-2">
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEditService(service)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteConfirmation(service)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            {isEditing ? "Edit Service" : "Add Service"}
                        </h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full border rounded-lg px-4 py-2"
                                value={newService.name}
                                onChange={(e) =>
                                    setNewService({ ...newService, name: e.target.value })
                                }
                            />
                            <CategoryDropdown
                                selectedCategory={newService.category}
                                setSelectedCategory={(category) =>
                                    setNewService({ ...newService, category })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                className="w-full border rounded-lg px-4 py-2"
                                value={newService.price}
                                onChange={(e) =>
                                    setNewService({ ...newService, price: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Bookings"
                                className="w-full border rounded-lg px-4 py-2"
                                value={newService.bookings}
                                onChange={(e) =>
                                    setNewService({ ...newService, bookings: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Revenue"
                                className="w-full border rounded-lg px-4 py-2"
                                value={newService.revenue}
                                onChange={(e) =>
                                    setNewService({ ...newService, revenue: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-2xl mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-2xl"
                                onClick={handleSaveService}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h3>
                        <p>Are you sure you want to delete this service?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-2xl mr-2"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-2xl"
                                onClick={confirmDeleteService}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ServiceBox;
