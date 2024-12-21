// import React, { useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; // Importing useSelector and useDispatch
// import { toast } from 'react-toastify'; // For error messages
// import LocationOnIcon from "@mui/icons-material/LocationOn";  // Correct import
// import GpsFixed from "@mui/icons-material/GpsFixed";  // Correct import
// import { setLatitude, setLongitude, locationAddressData } from '../slices/locationSlice'; // Correct import for actions

// const LocationInput = () => {
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [searchLocation, setSearchLocation] = useState(''); // Controlled state for input value
//   const inputRef = useRef();
//   const dispatch = useDispatch();
//   const location = useSelector((state) => state.location.location); // Accessing location state

//   const MAP_API = 'AlzaSy9VRVperivL6QcHsUWfuiwIJp9Fg6LNuAq'; // Replace with your actual API key
  
//   // Handle location search input change
//   const handleSearchInput = async (event) => {
//     const query = event.target.value;
//     setSearchLocation(query); // Update the searchLocation state on input change
//     if (query.length > 2) {
//       const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${MAP_API}`;
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         if (data?.predictions) {
//           setShowSuggestions(true);
//           setSuggestions(data.predictions);
//         } else {
//           setSuggestions([]);
//         }
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         toast.error('Failed to fetch location suggestions.');
//       }
//     } else {
//       setSuggestions([]);
//     }
//   };

//   // Handle suggestion click and update Redux store with location details
//   const handleSuggestionClick = (suggestion) => {
//     const geocodeUrl = `https://maps.gomaps.pro/maps/api/geocode/json?place_id=${suggestion.place_id}&key=${MAP_API}`;
//     fetch(geocodeUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         const location = data?.results?.[0]?.geometry?.location;
//         if (location) {
//           dispatch(setLatitude(location.lat)); // Dispatch latitude
//           dispatch(setLongitude(location.lng)); // Dispatch longitude
//           dispatch(locationAddressData(data?.results[0]?.formatted_address)); // Dispatch address
//           setSearchLocation(suggestion.description); // Update input
//           setShowSuggestions(false); // Hide suggestions
//           toast.success("Location selected successfully");
//         } else {
//           toast.error("Failed to fetch location details.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching location details:", error);
//         toast.error("Failed to fetch location details.");
//       });
//   };
  

//   // Get current location using geolocation API
//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
  
//           // Dispatch latitude and longitude to Redux
//           dispatch(setLatitude(latitude));
//           dispatch(setLongitude(longitude));
  
//           // Reverse geocode to get address
//           const geocodeUrl = `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAP_API}`;
//           try {
//             const response = await fetch(geocodeUrl);
//             const data = await response.json();
  
//             if (data?.results && data.results.length > 0) {
//               const formattedAddress = data.results[0].formatted_address;
//               dispatch(locationAddressData(formattedAddress)); // Dispatch address
//               setSearchLocation(formattedAddress); // Update input
//               toast.success("Location fetched successfully");
//             } else {
//               toast.error("Failed to fetch address.");
//             }
//           } catch (error) {
//             console.error("Error during reverse geocoding:", error);
//             toast.error("Failed to fetch address.");
//           }
//         },
//         (error) => {
//           if (error.code === error.PERMISSION_DENIED) {
//             toast.error("Please enable location services.");
//           } else {
//             toast.error(`Error getting location: ${error.message}`);
//           }
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by your browser.");
//     }
//   };
  

//   return (
//     <div className="edemand-input flex items-center justify-around gap-2 border px-2">
//       <span className='text-orange'><LocationOnIcon /></span>
//       <input
//         type="text"
//         placeholder="Enter Location, Area or City Name..."
//         ref={inputRef}
//         value={searchLocation} // Ensure controlled value is set correctly
//         onChange={handleSearchInput} // Update the state on change
//         className="w-full px-4 py-2 "
//       />
//       {showSuggestions && (
//         <ul className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-md w-full max-h-60 overflow-auto md:mt-60 mt-64 md:max-w-[50vw] max-w-[85vw] suggestions-list">
//           {suggestions.map((suggestion) => (
//             <li
//               key={suggestion.place_id}
//               onClick={() => handleSuggestionClick(suggestion)}
//               className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
//             >
//               {suggestion.description}
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="edemand-current-location-get text-orange">
//         <button className="btn" onClick={getCurrentLocation} >
//           <GpsFixed className="location-icon" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LocationInput;





import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GpsFixed from "@mui/icons-material/GpsFixed";
import { setLatitude, setLongitude, locationAddressData } from "../slices/locationSlice";

const LocationInput = ({ onCoordinatesChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const dispatch = useDispatch();

  const MAP_API = "AlzaSy9VRVperivL6QcHsUWfuiwIJp9Fg6LNuAq"; // Replace with your actual API key

  // Handle input change and fetch suggestions
  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchLocation(query);

    if (query.length > 2) {
      const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${MAP_API}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data?.predictions) {
          setSuggestions(data.predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        toast.error("Failed to fetch location suggestions.");
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const geocodeUrl = `https://maps.gomaps.pro/maps/api/geocode/json?place_id=${suggestion.place_id}&key=${MAP_API}`;
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        const location = data?.results?.[0]?.geometry?.location;
        if (location) {
          const coordinates = [location.lat, location.lng];
          dispatch(setLatitude(location.lat));
          dispatch(setLongitude(location.lng));
          onCoordinatesChange(coordinates);
          setSearchLocation(suggestion.description);
          setShowSuggestions(false);
          toast.success("Location selected successfully");
        } else {
          toast.error("Failed to fetch location details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching location details:", error);
        toast.error("Failed to fetch location details.");
      });
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const coordinates = [latitude, longitude];
          dispatch(setLatitude(latitude));
          dispatch(setLongitude(longitude));
          onCoordinatesChange(coordinates);

          const geocodeUrl = `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAP_API}`;
          try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data?.results?.length > 0) {
              const formattedAddress = data.results[0].formatted_address;
              dispatch(locationAddressData(formattedAddress));
              setSearchLocation(formattedAddress);
              toast.success("Location fetched successfully");
            } else {
              toast.error("Failed to fetch address.");
            }
          } catch (error) {
            console.error("Error during reverse geocoding:", error);
            toast.error("Failed to fetch address.");
          }
        },
        (error) => {
          toast.error("Error fetching location: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="edemand-input flex items-center justify-around gap-2 border px-2 relative">
      <span className="text-orange">
        <LocationOnIcon />
      </span>
      <input
        type="text"
        placeholder="Enter Location, Area or City Name..."
        value={searchLocation}
        onChange={handleSearchInput}
        className="w-full px-4 py-2"
      />
      {showSuggestions && (
        <ul className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-md w-full top-10 max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      <button className="btn" onClick={getCurrentLocation}>
        <GpsFixed className="location-icon text-orange" />
      </button>
    </div>
  );
};

export default LocationInput;
