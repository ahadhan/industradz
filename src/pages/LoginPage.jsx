

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PasswordInputWithStrength from "./PasswordInputWithStrength";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaCamera } from "react-icons/fa"; // Importing react-icons
import { useDispatch, useSelector } from 'react-redux';
import { setBusinessRegistered } from '../slices/businessRegisterSlice';
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';
// import { useHistory } from 'react-router-dom'; 


const AuthPage = () => {

  const defaultAvatar = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg";


  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [userType, setUserType] = useState("serviceProvider");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(defaultAvatar); // State for image preview
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const baseURL = "https://industradz-backend-new.onrender.com";


  const dispatch = useDispatch();
  // const history = useHistory();
  const isBusinessRegister = useSelector((state) => state.businessRegister.isBusinessRegister);


  // Handle image preview when file is selected
  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      setProfilePicture(file);
      if (file) {
        setProfilePreview(URL.createObjectURL(file)); // Set preview
      }
  
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "industradz"); // Replace with Cloudinary upload preset
          formData.append("cloud_name", "dq6dotbrs"); // Replace with your Cloudinary cloud name
  
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace your_cloud_name
            formData
          );
  
          const uploadedUrl = response.data.secure_url;
          setProfilePicture(uploadedUrl); // Save Cloudinary URL
          toast.success("Profile picture uploaded successfully!");
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload profile picture.");
        }
      }
    };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Validate form fields
  //     if (!email.trim() || !password.trim()) {
  //       toast.error("Please fill in all required fields.", { position: "top-center" });
  //       setLoading(false);
  //       return;

  //     }

  //     const response = await axios.post(`${baseURL}/api/auth/login`, {
  //       email: email.trim(),
  //       password: password,
  //       userType: "serviceProvider",
  //     });

  //     if (response.status === 200) {
  //       if (!isBusinessRegister) {
  //         // Show a toast notification
  //         toast.error('You need to register your business before accessing the dashboard.');

  //         // Redirect to business registration if not registered
  //         navigate('/business-registration');
  //       } else {
  //         // Continue with normal login flow
  //         toast.success(response.data.message || "Login successful!", { position: "top-center" });
  //         navigate("/dashboard"); // Example, change to your route
  //         }

  //       // Redirect or handle successful login
  //     } else {
  //       throw new Error("Unexpected response from server.");
  //     }
  //   } catch (error) {
  //     console.log("Error:", error)
  //     console.error("Error logging in user:", error.response?.data?.message || error.message);
  //     toast.error(error.response?.data?.message || "Error logging in user.", { position: "bottom-center" });
  //   } finally {
  //     setLoading(false); // Stop loader
  //   }
  // };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form fields
      if (!email.trim() || !password.trim()) {
        toast.error("Please fill in all required fields.", { position: "top-center" });
        setLoading(false);
        return;
      }

      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email: email.trim(),
        password: password,
        userType: "serviceProvider",
      });
      console.log("Backend Response:", response)
      if (response.status === 200) {
        const { token, message, isBusinessFound } = response.data.data; // Extract token from response

        if (token) {
          // Store token in localStorage
          const decodedAccessToken = jwtDecode(token);
          const accessTokenExpires = new Date(decodedAccessToken.exp * 1000);
          setCookie("token", token, { path: '/', expires: accessTokenExpires })
          toast.success(message || "Login successful!", { position: "top-center" });

          // Check if business registration is required
          if (!isBusinessFound) {
            toast.error("You need to register your business before accessing the dashboard.");
            navigate("/profileCreation");
          } else {
            navigate("/dashboard"); // Redirect to dashboard
          }
        } else {
          throw new Error("No token received. Authentication failed.");
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error logging in user:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Error logging in user.", { position: "bottom-center" });
    } finally {
      setLoading(false); // Stop loader
    }
  };



  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Validate form fields
  //     if (!age || isNaN(age) || parseInt(age, 10) <= 19) {
  //       toast.error("You must be older than 19 years to register.", { position: "top-center" });
  //       setLoading(false);
  //       return;
  //     }

  //     if (!fname.trim() || !email.trim() || !password.trim() || !phoneNumber.trim() || !userType) {
  //       toast.error("Please fill in all required fields.", { position: "top-center" });
  //       setLoading(false);
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("fullName", `${fname} ${lname}`.trim());
  //     formData.append("email", email.trim());
  //     formData.append("password", password);
  //     formData.append("age", age);
  //     formData.append("phoneNumber", phoneNumber.trim());
  //     formData.append("userType", userType);
  //     if (profilePicture) {
  //       formData.append("profilePicture", profilePicture);
  //     }
  //     console.log(formData);
  //     const response = await axios.post(`${baseURL}/api/auth/register`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.status === 201) {
  //       toast.success(response.data.message || "User registered successfully!", { position: "top-center" });
  //       setIsLogin(true); // Switch to login
  //     } else {
  //       throw new Error("Unexpected response from server.");
  //     }
  //   } catch (error) {
  //     console.error("Error registering user:", error.response?.data?.message || error.message);
  //     toast.error(error.response?.data?.message || "Error registering user.", { position: "bottom-center" });
  //   } finally {
  //     setLoading(false); // Stop loader
  //   }
  // };


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form fields
      if (!age || isNaN(age) || parseInt(age, 10) <= 19) {
        toast.error("You must be older than 19 years to register.", { position: "top-center" });
        setLoading(false);
        return;
      }

      if (!fname.trim() || !email.trim() || !password.trim() || !phoneNumber.trim() || !userType) {
        toast.error("Please fill in all required fields.", { position: "top-center" });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullName", `${fname} ${lname}`.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("age", age);
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("userType", userType);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await axios.post(`${baseURL}/api/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Backend Response:", response.data)

      if (response.data.success) {
        const { token, message } = response.data.data;

        if (token) {
          // Decode the token to get expiration time
          const decodedAccessToken = jwtDecode(token);
          const accessTokenExpires = new Date(decodedAccessToken.exp * 1000); // Convert expiration to JavaScript Date

          // Store the token in cookies
          setCookie("token", token, { path: "/", expires: accessTokenExpires });
          console.log(cookies)

          toast.success(message || "User registered successfully!", { position: "top-center" });

          // Redirect to business registration
          navigate("/profileCreation");
        } else {
          throw new Error("No token received. Registration failed.");
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error registering user:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Error registering user.", { position: "bottom-center" });
    } finally {
      setLoading(false); // Stop loader
    }
  };



  return (
    <div className="flex justify-center items-center bg-gray-50 py-6">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border-2 border-orange">
          <h3 className="text-4xl font-bold mb-6 text-center text-orange">
            {isLogin ? "Login" : "User Registration"}
          </h3>

          {/* Image preview */}
          {!isLogin && profilePreview && (
            <div className="mb-4 text-center">
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
            </div>
          )}



          {!isLogin && (
            <>
              <label className="block text-gray-600 mb-2">Enter your name :</label>
              <div className="mb-4 flex items-center border rounded-lg">

                <FaUser className="text-gray-600 mx-3" /> {/* User Icon */}
                <input
                  type="text"
                  className="w-full px-4 py-2 border-none rounded-lg"
                  placeholder="First name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </div>


              <div className="mb-4 flex items-center border rounded-lg">
                <FaUser className="text-gray-600 mx-3" /> {/* User Icon */}
                <input
                  type="text"
                  className="w-full px-4 py-2 border-none rounded-lg"
                  placeholder="Last name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>


              <label className="block text-gray-600 mb-2">Age</label>


              <div className="mb-4 flex items-center border rounded-lg">
                <FaCalendarAlt className="text-gray-600 mx-3" /> {/* Birthday Icon */}
                <input
                  type="number"
                  className="w-full px-4 py-2 border-none rounded-lg"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              {/* <div className="mb-4">
                
                <label className="block text-gray-600 mb-2">Phone Number</label>
                <FaPhone className="text-gray-600 mx-3" />                
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div> */}

              <div className="mb-4 flex items-center border rounded-lg">
                <FaPhone className="text-gray-600 mx-3" /> {/* Phone Icon */}
                <input
                  type="text"
                  className="w-full px-4 py-2 border-none rounded-lg"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Profile Picture (Optional)</label>
                <input
                  type="file"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={handleImageChange} // Use the new handler
                />
              </div>
            </>
          )}



          <div className="mb-4 flex items-center border rounded-lg">
            <FaEnvelope className="text-gray-600 mx-3" /> {/* Email Icon */}
            <input
              type="email"
              className="w-full px-4 py-2 border-none rounded-lg"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLogin ? (
            <PasswordInputWithStrength password={password} setPassword={setPassword} />
          ) : (
            <>
              <label className="block text-gray-600 mb-2">Password</label>
              <div className="mb-4 flex items-center border rounded-lg">
                <FaLock className="text-gray-600 mx-3" />
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>

          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white"
            style={{
              backgroundColor: "#ff8806",
              hover: { backgroundColor: "#e67a05" },
              transition: "all 0.3s",
            }}
            disabled={loading}
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            {isLogin ? (
              <>
                New user?{" "}
                <span
                  className="text-orange hover:underline cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  Register Here
                </span>
              </>
            ) : (
              <>
                Already registered?{" "}
                <span
                  className="text-orange hover:underline cursor-pointer"
                  onClick={() => setIsLogin(true)}
                >
                  Login Here
                </span>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
