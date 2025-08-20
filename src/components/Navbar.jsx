import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * Navigation bar component with dark/light mode toggle.
 */
function Navbar({ darkMode, setDarkMode }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className={`flex justify-between items-center px-6 py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <Link to="/" className="font-bold text-lg">
        Ardhi Spatial System
      </Link>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="font-medium">{currentUser?.username || currentUser?.email}</span>
            <Link to="/map" className="hover:underline">Map</Link>
            <Link to="/data" className="hover:underline">Data</Link>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="hover:underline">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1 rounded ${darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' : 'bg-gray-900 text-white hover:bg-gray-700'} transition`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
