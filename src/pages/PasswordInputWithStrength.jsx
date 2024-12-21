import React, { useState } from "react";
import {FaLock} from "react-icons/fa";

const PasswordInputWithStrength = ({
  password,
  setPassword }) => {
  const [strength, setStrength] = useState("");

  const evaluateStrength = (input) => {
    if (input.length === 0) {
      setStrength("");
    } else if (input.length < 6) {
      setStrength("Weak");
    } else if (input.length > 8) {
      setStrength("Strong");
    } else {
      setStrength("Moderate");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    evaluateStrength(value);
  };

  return (
    <>
      <label className="block tex‮t-gray-600 mb-2">Password</label>
      <div className="mb-4 flex items-center border rounded-lg">
        <FaLock className="text-gray-600 mx-3" />

        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {strength && (
          <p
            className={`text-sm mt-1 ${strength === "Strong"
              ? "text-green-500"
              : strength === "Moderate"
                ? "text-yellow-500"
                : "text-red-500"
              }`}
          >
            Password Strength: {strength}
          </p>
        )}
      </div>
    </>

  );
};

export default PasswordInputWithStrength;
