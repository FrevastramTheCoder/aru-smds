
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * Navigation bar component.
 */
function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Ardhi Spatial System</Link>
      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-white">{currentUser?.username || currentUser?.email}</span>
            <Link to="/map" className="navbar-link">Map</Link>
            <Link to="/data" className="navbar-link">Data</Link>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="navbar-link">Admin</Link>
            )}
            <button onClick={handleLogout} className="navbar-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
