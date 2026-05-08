import React, { useState } from "react";
import API from "../api";

const Register = ({ toggleAuth }) => {
  // State to hold user input data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to backend API
      const res = await API.post("/auth/register", formData);
      alert(res.data.msg); // "Registration successful!"
      toggleAuth(); // Switch to login screen after success
    } catch (err) {
      // Display error message from backend
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 border rounded shadow-md bg-white"
    >
      <h2 className="text-xl mb-4 font-bold text-center">Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="block border p-2 mb-2 w-full"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        className="block border p-2 mb-2 w-full"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="block border p-2 mb-4 w-full"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white p-2 w-full font-semibold"
      >
        Register
      </button>

      <p className="mt-4 text-sm text-center">
        Already have an account?
        <span
          className="text-blue-500 cursor-pointer ml-1"
          onClick={toggleAuth}
        >
          Login here
        </span>
      </p>
    </form>
  );
};

export default Register;
