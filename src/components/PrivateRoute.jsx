import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects routes by requiring authentication.
 */
function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
