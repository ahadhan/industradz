// import { PlusCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { openModal, closeModal } from "../../../slices/modalSlice";


// const AddServiceButton = () => {


//   const isModalOpen = useSelector((state) => state.modal.isModalOpen);
//   const dispatch = useDispatch();

//   const navigate = useNavigate();
  
  

//   const handleOptionClick = (option) => {
//     navigate(`/dashboard/addservices `);
//     // alert(`You selected: ${option}`);
//     dispatch(closeModal()); // Close modal after selection
//   };



//   return (
//     <>

//       <button
//         className={`bg-orange text-white px-4 py-2 flex items-center gap-2 rounded-2xl ${isModalOpen ? "hidden" : "block"}`}
//         onClick={() => dispatch(openModal())}
//       >
//         <PlusCircle size={18} />
//         Service Type
//       </button>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className={`h-auto  text-white px-4 py-2 flex items-center gap-2  mt-10`}> 
//                  <div className="bg-gray-100 border-2 border-orange rounded-xl shadow-lg max-w-lg w-full p-6">
//             <h2 className="text-xl text-orange font-bold text-center mb-4">
//               Choose a Service you want to Offer
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Industrial Offerings Card */}
//               <div
//                 className="border p-4  hover:shadow-lg transition cursor-pointer bg-orange rounded-xl hover:scale-105"
//                 onClick={() => handleOptionClick("Industrial Offerings")}
//               >
//                 <h3 className="font-semibold text-xl text-center">
//                   Industrial Offerings
//                 </h3>
//                 <p className="text-sm text-gray-900 mt-2 text-center">
//                   Want to offer industrial services? Click here.
//                 </p>
//               </div>

//               {/* Marketplace Card */}
//               <div
//                 className="border p-4  hover:shadow-lg transition cursor-pointer bg-orange rounded-xl hover:scale-105"
//                 onClick={() => handleOptionClick("Marketplace")}
//               >
//                 <h3 className="font-semibold text-xl text-center">
//                   Marketplace
//                 </h3>
//                 <p className="text-sm text-gray-900 mt-2 text-center">
//                   Want to sell your products on our marketplace? Click here
//                 </p>
//               </div>
//             </div>
//             <div className="text-right mt-4">
//               <button
//                 onClick={() => dispatch(closeModal())}
//                 className="px-4 py-2 bg-orange text-gray-900 rounded hover:scale-105 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </>

//   );
// };

// export default AddServiceButton;



import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../../slices/modalSlice";

const AddServiceButton = () => {
  const isModalOpen = useSelector((state) => state.modal.isModalOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // New state to track current view: 'main' or 'marketplace'
  const [currentView, setCurrentView] = useState("main");

  const handleOptionClick = (option) => {
    if (option === "Marketplace") {
      setCurrentView("marketplace"); // Switch to marketplace sub-options
    } else {
      navigate(`/dashboard/addIndustrialService`);
      dispatch(closeModal()); // Close modal after navigation
    }
  };

  const handleSubOptionClick = (subOption) => {
    navigate(`/dashboard/addservices/${subOption.toLowerCase()}`);
    dispatch(closeModal()); // Close modal after navigation
  };

  const handleBack = () => {
    setCurrentView("main"); // Go back to main options
  };

  return (
    <>
      <button
        className={`bg-orange text-white px-4 py-2 flex items-center gap-2 rounded-2xl ${isModalOpen ? "hidden" : "block"}`}
        onClick={() => dispatch(openModal())}
      >
        <PlusCircle size={18} />
        Add Service
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className={`h-auto  text-white px-4 py-2 flex items-center gap-2  mt-10`}>
          <div className="bg-gray-100 border-2 border-orange rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-xl text-orange font-bold text-center mb-4">
              {currentView === "main" ? "Choose a Service you want to Offer" : "Choose a Marketplace Option"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentView === "main" ? (
                <>
                  {/* Industrial Offerings Card */}
                  <div
                    className="border p-4 hover:shadow-lg transition cursor-pointer bg-orange text-white rounded-xl hover:scale-105"
                    onClick={() => handleOptionClick("Industrial Offerings")}
                  >
                    <h3 className="font-semibold text-xl text-center">Industrial Offerings</h3>
                    <p className="text-sm text-gray-900 mt-2 text-center">
                      Want to offer industrial services? Click here.
                    </p>
                  </div>

                  {/* Marketplace Card */}
                  <div
                    className="border p-4 hover:shadow-lg transition cursor-pointer bg-orange text-white rounded-xl hover:scale-105"
                    onClick={() => handleOptionClick("Marketplace")}
                  >
                    <h3 className="font-semibold text-xl text-center">Marketplace</h3>
                    <p className="text-sm text-gray-900 mt-2 text-center">
                      Want to sell your products on our marketplace? Click here.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Industrial Machines Card */}
                  <div
                    className="border p-4 hover:shadow-lg transition cursor-pointer bg-orange text-white rounded-xl hover:scale-105"
                    onClick={() => handleSubOptionClick("industrial-machines")}
                  >
                    <h3 className="font-semibold text-xl text-center">Industrial Machines</h3>
                    <p className="text-sm text-gray-900 mt-2 text-center">
                      Offer industrial machines in our marketplace.
                    </p>
                  </div>

                  {/* Raw Materials Card */}
                  <div
                    className="border p-4 hover:shadow-lg transition cursor-pointer bg-orange text-white rounded-xl hover:scale-105"
                    onClick={() => handleSubOptionClick("raw-material")}
                  >
                    <h3 className="font-semibold text-xl text-center">Raw Materials</h3>
                    <p className="text-sm text-gray-900 mt-2 text-center">
                      Sell raw materials through our platform.
                    </p>
                  </div>

                  {/* Spare Parts Card */}
                  <div
                    className="border p-4 hover:shadow-lg transition cursor-pointer bg-orange text-white rounded-xl hover:scale-105"
                    onClick={() => handleSubOptionClick("spare-parts")}
                  >
                    <h3 className="font-semibold text-xl text-center">Spare Parts</h3>
                    <p className="text-sm text-gray-900 mt-2 text-center">
                      Offer spare parts to our customers.
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="text-right flex justify-center gap-4 mt-10">
              {currentView === "marketplace" && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:scale-105 transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 bg-orange text-gray-100 rounded hover:scale-105 transition "
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
