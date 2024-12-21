import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../../slices/modalSlice";


const AddServiceButton = () => {


  const isModalOpen = useSelector((state) => state.modal.isModalOpen);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const handleOptionClick = (option) => {
    alert(`You selected: ${option}`);
    dispatch(closeModal()); // Close modal after selection
  };



  return (
    <>

      <button
        className="bg-orange text-white px-4 py-2 flex items-center gap-2 rounded-2xl"
        onClick={() => dispatch(openModal())}
      >
        <PlusCircle size={18} />
        Service Type
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className={`h-screen flex items-center justify-center bg-gray-100 `}>          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-center mb-4">
              Choose an Option
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Industrial Offerings Card */}
              <div
                className="border p-4 rounded-lg hover:shadow-lg transition cursor-pointer"
                onClick={() => handleOptionClick("Industrial Offerings")}
              >
                <h3 className="font-semibold text-lg text-center">
                  Industrial Offerings
                </h3>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Explore a variety of industrial services and products tailored
                  to your needs.
                </p>
              </div>

              {/* Marketplace Card */}
              <div
                className="border p-4 rounded-lg hover:shadow-lg transition cursor-pointer"
                onClick={() => handleOptionClick("Marketplace")}
              >
                <h3 className="font-semibold text-lg text-center">
                  Marketplace
                </h3>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Discover a marketplace full of innovative solutions and
                  offerings.
                </p>
              </div>
            </div>
            <div className="text-right mt-4">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>

  );
};

export default AddServiceButton;
