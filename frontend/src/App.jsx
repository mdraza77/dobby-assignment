import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login and Register

  // Function to clear session (Logout)
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {isLoginView ? (
        <Login setToken={setToken} toggleAuth={() => setIsLoginView(false)} />
      ) : (
        <Register toggleAuth={() => setIsLoginView(true)} />
      )}
    </div>
  );
}

export default App;
