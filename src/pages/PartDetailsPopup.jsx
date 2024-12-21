// components/PartDetailsPopup.js
import React from "react";

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
          <span className="font-medium">Compatibility:</span> {part.compatibility}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Condition:</span> {part.condition}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Availability:</span> {part.availability}
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

export default PartDetailsPopup;