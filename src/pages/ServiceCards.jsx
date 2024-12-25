// src/components/ServiceCard.jsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openModal, closeModal } from "../slices/modalSlice";

const ServiceCard = ({ service, onDelete }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEdit = () => {
        // Dispatch action to open modal with service data
        dispatch(openModal(service));
    };

    const handleDelete = () => {
        onDelete(service);
    };

    const handleCardClick = () => {
        navigate(`/services/${service.id}`);
    };

    return (
        <div
            className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={handleCardClick}
        >
            <img
                className="w-full h-48 object-cover"
                src={service.coverImage || 'https://via.placeholder.com/400x300'}
                alt={service.name}
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-2">${service.price.toFixed(2)}</p>
                <p className="text-gray-700 text-sm">{service.description.substring(0, 100)}...</p>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
