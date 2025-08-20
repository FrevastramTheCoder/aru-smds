// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaMapMarkedAlt, FaTable, FaDatabase, FaChartBar, FaUsers, FaCogs, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dark/light mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const pages = [
    { title: "Map View", route: "/map", icon: <FaMapMarkedAlt size={40} className="text-blue-500" /> },
    { title: "Data Management", route: "/data", icon: <FaDatabase size={40} className="text-green-500" /> },
    { title: "Data View", route: "/data-view", icon: <FaChartBar size={40} className="text-purple-500" /> },
    { title: "Data Table", route: "/data-table", icon: <FaTable size={40} className="text-orange-500" /> },
    { title: "Admin Panel", route: "/admin", icon: <FaUsers size={40} className="text-red-500" /> },
    { title: "Settings", route: "/settings", icon: <FaCogs size={40} className="text-gray-500" /> },
    { title: "Logout", route: "/logout", icon: <FaSignOutAlt size={40} className="text-black" /> },
  ];

  const handleNavigate = (route) => {
    if (route === "/logout") {
      localStorage.removeItem("token"); // Clear token
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  return (
    <div className={`container mx-auto my-8 px-4 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-yellow-400 dark:bg-gray-700 hover:scale-105 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pages.map((page) => {
          const isActive = location.pathname === page.route;
          return (
            <div
              key={page.title}
              onClick={() => handleNavigate(page.route)}
              className={`cursor-pointer rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition
                ${darkMode
                  ? isActive
                    ? "bg-blue-800 border-2 border-blue-500"
                    : "bg-gray-800 hover:shadow-2xl"
                  : isActive
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white hover:shadow-2xl"
                }`}
            >
              {page.icon}
              <h2 className="mt-4 text-xl font-semibold">{page.title}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
