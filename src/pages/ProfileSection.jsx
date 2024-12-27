// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { User } from "lucide-react";
// import SettingSection from "../dashboard/components/settings/SettingSection";

// const Profile = () => {
//   const [userDetails, setUserDetails] = useState(null);
//   const [editedData, setEditedData] = useState({
//     fullName: "",
//     age: "",
//     phoneNumber: "",
//     profilePicture: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);

//   const baseURL = "https://industradz-backend-new.onrender.com";

//   // Fetch user data
//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("You are not logged in. Please log in first.");
//         return;
//       }

//       const response = await axios.get(`${baseURL}/api/business/profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const { data } = response.data;
//       setUserDetails(data);
//       setEditedData({
//         fullName: data.fullName || "",
//         age: data.age || "",
//         phoneNumber: data.phoneNumber || "",
//         profilePicture: null,
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch user data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle edit profile
//   const handleEditProfile = async (e) => {
//     e.preventDefault();

//     if (parseInt(editedData.age, 10) <= 19) {
//       toast.error("Age must be greater than 19 years.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("You are not logged in. Please log in first.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("fullName", editedData.fullName);
//       formData.append("phoneNumber", editedData.phoneNumber);
//       formData.append("age", editedData.age);
//       if (editedData.profilePicture) {
//         formData.append("profilePicture", editedData.profilePicture);
//       }

//       const response = await axios.post(`${baseURL}/api/auth/edit`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success(response.data.message || "Profile updated successfully!");
//       setUserDetails(response.data.data.user);
//       setEditMode(false);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update profile.");
//     }
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${baseURL}/api/auth/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message || "Logged out successfully!");
//         localStorage.removeItem("token");
//         window.location.reload();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to log out.");
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="loader">
//           <div className="justify-content-center jimu-primary-loading"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>

//     <SettingSection icon={User} title={"Profile"}>
//       {userDetails ? (
//         <div className="flex flex-col items-center sm:flex-row sm:items-start mb-6">
//           <img
//             src={userDetails.profilePicture || "https://via.placeholder.com/150"}
//             alt="Profile"
//             className="rounded-full object-cover sm:mr-4"
//           />

//           <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
//             <h3 className="text-lg font-semibold">{userDetails.fullName || "N/A"}</h3>
//             <p className="text-gray-600">{userDetails.email || "N/A"}</p>
//             {userDetails.userType && (
//               <p className="text-gray-500">User Type: {userDetails.userType}</p>
//             )}
//             {userDetails.phoneNumber && (
//               <p className="text-gray-500">Phone: {userDetails.phoneNumber}</p>
//             )}
//             {userDetails.age && <p className="text-gray-500">Age: {userDetails.age}</p>}
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-600">No user details available. Please log in.</p>
//       )}

//       {editMode && (
//         <form onSubmit={handleEditProfile} className="mb-6">
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Full Name</label>
//             <input
//               type="text"
//               value={editedData.fullName}
//               onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
//               className="border rounded p-2 w-full"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Phone Number</label>
//             <input
//               type="text"
//               value={editedData.phoneNumber}
//               onChange={(e) =>
//                 setEditedData({ ...editedData, phoneNumber: e.target.value })
//               }
//               className="border rounded p-2 w-full"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Age</label>
//             <input
//               type="number"
//               value={editedData.age}
//               onChange={(e) => setEditedData({ ...editedData, age: e.target.value })}
//               className="border rounded p-2 w-full"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Profile Picture</label>
//             <input
//               type="file"
//               onChange={(e) =>
//                 setEditedData({ ...editedData, profilePicture: e.target.files[0] })
//               }
//               className="border rounded p-2 w-full"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-orange text-white font-bold py-2 px-4 rounded"
//           >
//             Save Changes
//           </button>
//         </form>
//       )}

//       <div className="flex flex-col sm:flex-row gap-4">
//         <button
//           onClick={() => setEditMode((prev) => !prev)}
//           className="bg-orange text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
//         >
//           {editMode ? "Cancel" : "Edit Profile"}
//         </button>

//         <button
//           onClick={handleLogout}
//           className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
//         >
//           Logout
//         </button>
//       </div>
//     </SettingSection>
//       </main>
//   );
// };

// export default Profile;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { User } from "lucide-react";
import SettingSection from "../dashboard/components/settings/SettingSection";

const BusinessProfile = () => {
  const [businessDetails, setBusinessDetails] = useState(null); // Updated to store a single object
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [cookies] = useCookies(["token"]);

  const fetchBusinessDetails = async () => {
    console.log(cookies.token)
    try {
      const response = await axios.get(
        `http://industradz-backend-new.onrender.com/api/business/profile`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`, // Include the bearer token from cookies
          },
        }
      );
      setBusinessDetails(response.data.data); // Assuming `data` contains the single business object
      setLoading(false);
    } catch (error) {
      console.error("Error fetching business details:", error);
      toast.error("Failed to fetch business details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const handleEditBusinessProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://industradz-backend-new.onrender.com/api/business/profile`,
        businessDetails,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`, // Include the bearer token in the PUT request
          },
        }
      );
      toast.success("Business profile updated successfully!");
      setBusinessDetails(response.data.data); // Update state with the updated business details
      setEditMode(false);
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast.error("Failed to update business profile.");
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!businessDetails) {
    return <p>No business details found.</p>;
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-6">
      <SettingSection icon={User} title="Business Profile">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-8">
            <div className="relative">
              <img
                src={businessDetails.banner || "https://via.placeholder.com/400x150"}
                alt="Banner"
                className="rounded-lg w-full object-cover h-40"
              />
              <img
                src={businessDetails.logo || "https://via.placeholder.com/150"}
                alt="Logo"
                className="rounded-full w-24 h-24 object-cover border-4 border-white absolute bottom-0 left-4 transform translate-y-1/2 shadow-lg"
              />
            </div>
          </div>

          {!editMode ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                {businessDetails.businessName}
              </h3>
              <p className="text-gray-700 text-lg">{businessDetails.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-orange-600 font-semibold">Business Type</p>
                  <p className="text-gray-700">{businessDetails.businessType}</p>
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">Years of Experience</p>
                  <p className="text-gray-700">
                    {businessDetails.years_of_experience} years
                  </p>
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">Expertise Level</p>
                  <p className="text-gray-700">{businessDetails.expertise_level}</p>
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">Business Email</p>
                  <a
                    href={`mailto:${businessDetails.contact_info.businessEmail}`}
                    className="text-blue-600 underline"
                  >
                    {businessDetails.contact_info.businessEmail}
                  </a>
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">Website</p>
                  <a
                    href={businessDetails.contact_info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {businessDetails.contact_info.website}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditBusinessProfile} className="space-y-4 border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={businessDetails.businessName}
                    onChange={handleFieldChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Business Type</label>
                  <input
                    type="text"
                    name="businessType"
                    value={businessDetails.businessType}
                    onChange={handleFieldChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </form>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </SettingSection>
    </main>
  );
};

export default BusinessProfile;
