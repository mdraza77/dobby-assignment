import React from "react";

const Dashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header / Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Dobby Drive</h1>

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Welcome to your Dashboard
        </h2>

        {/* Placeholder for Folders and Files */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white border rounded-lg shadow-sm text-center">
            📁 Folders will appear here
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-sm text-center">
            📄 Files will appear here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
