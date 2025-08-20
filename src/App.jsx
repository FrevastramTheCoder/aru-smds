// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import SystemDashboard from './pages/SystemDashboard';
import AdminPanel from './pages/AdminPanel';
import MapView from './pages/MapView';
import DataManagement from './pages/DatamanagementPage.jsx';
import DataTable from './pages/DataTable.jsx'; // New DataTable page
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import GoogleAuthCallback from "./components/GoogleAuthCallback";

/**
 * Main application component with routing and authentication provider.
 */
function App() {
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '955498693856-p6rkogqc5i54vtfm0pek76kvb9hgcbl7.apps.googleusercontent.com';

  // Dark/light mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark mode class to html
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<SystemDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/dashboard" element={<SystemDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/admin" element={<AdminPanel darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/map" element={<MapView darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/data" element={<DataManagement darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/data-table" element={<DataTable darkMode={darkMode} setDarkMode={setDarkMode} />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
