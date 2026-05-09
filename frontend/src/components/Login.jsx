import React, { useState } from "react";
import API from "../api";

const Login = ({ setToken, toggleAuth }) => {
  // Added toggleAuth prop
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      console.log("Login Successful!");
    } catch (err) {
      console.log(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 border rounded shadow-md bg-white"
    >
      <h2 className="text-xl mb-4 font-bold text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
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
        className="bg-blue-500 text-white hover:bg-blue-700 active:bg-blue-800 px-3 py-3 rounded cursor-pointer w-full font-bold"
      >
        Login
      </button>

      {/* Added this link to switch to Register */}
      <p className="mt-4 text-sm text-center">
        Don't have an account?
        <span
          className="text-blue-500 cursor-pointer ml-1"
          onClick={toggleAuth}
        >
          Register here
        </span>
      </p>
    </form>
  );
};

export default Login;
