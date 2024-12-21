import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const serviceCards = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    // Redirect based on the chosen option
    if (option === 'option1') {
      navigate('/page1');  // Change to your desired route
    } else {
      navigate('/page2');  // Change to your desired route
    }
    onClose();  // Close modal after selection
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Choose an option</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleOptionClick('option1')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Option 1
          </button>
          <button
            onClick={() => handleOptionClick('option2')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Option 2
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default serviceCards;
