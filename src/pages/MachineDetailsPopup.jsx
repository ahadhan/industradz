import React from "react";

const MachineDetailsPopup = ({ machine, onClose }) => {
  if (!machine) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-800">{machine.title}</h2>
        <img
          src={machine.image}
          alt={machine.title}
          className="w-full h-48 object-cover rounded-lg my-4"
        />
        <p className="text-sm text-gray-600">
          <span className="font-medium">Condition:</span> {machine.condition}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Brand:</span> {machine.brand}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Location:</span> {machine.location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price:</span> {machine.price}
        </p>
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

export default MachineDetailsPopup;
