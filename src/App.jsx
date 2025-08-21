import React from 'react';
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
import DataView from './pages/DataView.jsx'; // <-- Data View Page
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import GoogleAuthCallback from "./components/GoogleAuthCallback";

/**
 * Main application component with routing and authentication provider.
 */
function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
    '955498693856-p6rkogqc5i54vtfm0pek76kvb9hgcbl7.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
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
                <Route path="/" element={<SystemDashboard />} />
                <Route path="/dashboard" element={<SystemDashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/data" element={<DataManagement />} />
                <Route path="/data-view" element={<DataView />} /> {/* Corrected Data View Route */}
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
