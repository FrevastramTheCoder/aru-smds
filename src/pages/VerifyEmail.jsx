import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('No verification token provided');
        return;
      }

      try {
        const baseApiUrl = import.meta.env.VITE_API_URL;
        console.log('Verification URL:', `${baseApiUrl}/verify-email?token=${token}`);
        const response = await axios.get(`${baseApiUrl}/verify-email?token=${token}`);
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Email verification failed');
      }
    };
    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="verify-email-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="verify-email-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Email Verification</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
  );
}

export default VerifyEmail;