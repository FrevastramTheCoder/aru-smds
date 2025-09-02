import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SystemDashboard from './pages/SystemDashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import MapView from './pages/MapView.jsx';
import DataManagement from './pages/DatamanagementPage.jsx';
import DataView from './pages/DataView.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import GoogleAuthCallback from './components/GoogleAuthCallback.jsx';

/**
 * Main application component with routing and authentication provider.
 */
function App() {
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
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
                <Route path="/data-view" element={<DataView />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// ✅ Export default so Vercel can import it correctly
export default App;
