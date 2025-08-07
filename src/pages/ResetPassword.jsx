import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');
    if (!token) {
      setError('No reset token provided');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { token, password });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="reset-password-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="reset-password-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Reset Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="reset-password-form">
          <div className="input-wrapper mb-4">
            <Lock className="input-icon w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
              placeholder="New Password"
              required
            />
          </div>
          <button
            onClick={handleResetPassword}
            className="btn-primary bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;