import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";
import SettingSection from "../dashboard/components/settings/SettingSection";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [editedData, setEditedData] = useState({
    fullName: "",
    age: "",
    phoneNumber: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const baseURL = "https://industradz-backend-new.onrender.com";

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in first.");
        return;
      }

      const response = await axios.get(`${baseURL}/api/business/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data;
      setUserDetails(data);
      setEditedData({
        fullName: data.fullName || "",
        age: data.age || "",
        phoneNumber: data.phoneNumber || "",
        profilePicture: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit profile
  const handleEditProfile = async (e) => {
    e.preventDefault();

    if (parseInt(editedData.age, 10) <= 19) {
      toast.error("Age must be greater than 19 years.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in first.");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", editedData.fullName);
      formData.append("phoneNumber", editedData.phoneNumber);
      formData.append("age", editedData.age);
      if (editedData.profilePicture) {
        formData.append("profilePicture", editedData.profilePicture);
      }

      const response = await axios.post(`${baseURL}/api/auth/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "Profile updated successfully!");
      setUserDetails(response.data.data.user);
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Logged out successfully!");
        localStorage.removeItem("token");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log out.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>
      </div>
    );
  }

  return (
    <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>

    <SettingSection icon={User} title={"Profile"}>
      {userDetails ? (
        <div className="flex flex-col items-center sm:flex-row sm:items-start mb-6">
          <img
            src={userDetails.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-full object-cover sm:mr-4"
          />

          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">{userDetails.fullName || "N/A"}</h3>
            <p className="text-gray-600">{userDetails.email || "N/A"}</p>
            {userDetails.userType && (
              <p className="text-gray-500">User Type: {userDetails.userType}</p>
            )}
            {userDetails.phoneNumber && (
              <p className="text-gray-500">Phone: {userDetails.phoneNumber}</p>
            )}
            {userDetails.age && <p className="text-gray-500">Age: {userDetails.age}</p>}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No user details available. Please log in.</p>
      )}

      {editMode && (
        <form onSubmit={handleEditProfile} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={editedData.fullName}
              onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              value={editedData.phoneNumber}
              onChange={(e) =>
                setEditedData({ ...editedData, phoneNumber: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              value={editedData.age}
              onChange={(e) => setEditedData({ ...editedData, age: e.target.value })}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Profile Picture</label>
            <input
              type="file"
              onChange={(e) =>
                setEditedData({ ...editedData, profilePicture: e.target.files[0] })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-orange text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="bg-orange text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </SettingSection>
      </main>
  );
};

export default Profile;
