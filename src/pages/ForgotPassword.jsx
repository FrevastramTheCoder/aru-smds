import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setMessage('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const responseMessage = await forgotPassword(email);
      setMessage(responseMessage || 'Password reset email sent!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset email');
    }
  };

  return (
    <div className="register-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="register-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="register-header text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Forgot Password</h1>
        {error && <p className="error-message text-red-500 mb-4">{error}</p>}
        {message && <p className="success-message text-green-500 mb-4">{message}</p>}
        <div className="register-form">
          <div className="input-wrapper mb-4">
            <Mail className="input-icon w-5 h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
              placeholder="Email"
              required
            />
          </div>
          <button
            onClick={handleForgotPassword}
            className="btn-primary bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Send Reset Email
          </button>
          <div className="register-footer mt-4 text-center">
            Back to <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;