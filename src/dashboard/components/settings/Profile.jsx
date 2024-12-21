import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ fullName: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const baseURL = "https://industradz-backend-new.onrender.com";

  // Fetch user profile
  const fetchUserProfile = async () => {
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
      setUserDetails({ fullName: data.fullName || "", email: data.email || "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in first.");
        return;
      }

      const response = await axios.post(
        `${baseURL}/api/auth/edit`,
        {
          fullName: userDetails.fullName,
          email: userDetails.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src="https://randomuser.me/api/portraits/men/3.jpg"
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />

        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              className="border rounded px-3 py-2"
              placeholder="Full Name"
              value={userDetails.fullName}
              onChange={(e) =>
                setUserDetails({ ...userDetails, fullName: e.target.value })
              }
            />
            <input
              type="email"
              className="border rounded px-3 py-2"
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">{userDetails.fullName || "N/A"}</h3>
            <p className="text-gray-600">{userDetails.email || "N/A"}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {isEditing ? (
          <button
            onClick={handleSaveProfile}
            className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-orange text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Edit Profile
          </button>
        )}

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Cancel
          </button>
        )}
      </div>
    </SettingSection>
  );
};

export default Profile;
