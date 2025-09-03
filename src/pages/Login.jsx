// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Mail, Lock, Loader2 } from 'lucide-react';

// export default function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, error: authError, setError } = useAuth();
//   const navigate = useNavigate();

//   const baseApiUrl = import.meta.env.VITE_API_URL || '/api/v1/auth';

//   // Handle Google OAuth redirect token and verifiedEmail
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     const errorParam = urlParams.get('error');
//     const errorDetails = urlParams.get('details');
//     const verifiedEmail = urlParams.get('verifiedEmail');

//     if (errorParam === 'google_auth_failed') {
//       setError(
//         `Google login failed: ${decodeURIComponent(
//           errorDetails || 'Please try again or use email/password.'
//         )}`
//       );
//     } else if (token) {
//       // Save token to localStorage
//       localStorage.setItem('token', token);

//       setMessage('Google login successful!');

//       // Remove token from URL to prevent 404 on refresh
//       const cleanUrl = window.location.origin + window.location.pathname;
//       window.history.replaceState({}, document.title, cleanUrl);

//       // Redirect to dashboard
//       navigate('/dashboard');
//     }

//     if (verifiedEmail) {
//       setFormData((prev) => ({ ...prev, email: verifiedEmail }));
//       setMessage('Email verified! You can now log in.');
//     }
//   }, [navigate, setError]);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError(null);
//     setMessage('');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setMessage('');

//     try {
//       await login(formData);
//       setMessage('Login successful!');
//       setTimeout(() => navigate('/dashboard'), 1000);
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h1 className="login-title">Welcome Back</h1>
//         {authError && <p className="error-message">{authError}</p>}
//         {message && <p className="success-message">{message}</p>}

//         <form onSubmit={handleLogin} className="login-form">
//           <div className="input-wrapper">
//             <Mail className="input-icon" />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="input-with-icon"
//               placeholder="Email"
//               required
//               autoComplete="email"
//             />
//           </div>

//           <div className="input-wrapper">
//             <Lock className="input-icon" />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="input-with-icon"
//               placeholder="Password"
//               required
//               autoComplete="current-password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="animate-spin w-5 h-5 inline mr-2" />
//                 Logging in...
//               </>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>

//         <div className="forgot-password-link">
//           <a href="/forgot-password" className="forgot-password-btn">
//             Forgot password?
//           </a>
//         </div>

//         <div className="divider-with-text">or</div>

//         <div className="social-buttons">
//           <button
//             onClick={() => {
//               window.location.href = `${baseApiUrl}/google`;
//             }}
//             disabled={isLoading}
//             className={`social-button google ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             aria-label="Sign in with Google"
//           >
//             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12.24 10.4v3.2h5.76c-.24 1.28-1.76 3.76-5.76 3.76-3.44 0-6.24-2.88-6.24-6.4s2.8-6.4 6.24-6.4c1.6 0 3.04.64 4.08 1.68l2.88-2.88C16.8 1.36 14.64 0 12.24 0 6.64 0 2.4 4.24 2.4 9.6s4.24 9.6 9.84 9.6c5.76 0 9.6-4.08 9.6-9.6 0-.64-.08-1.28-.24-1.92h-9.36z" />
//             </svg>
//             <span>Sign in with Google</span>
//           </button>
//         </div>

//         <div className="register-link">
//           Don't have an account? <a href="/register">Register</a>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, googleLogin, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  const baseApiUrl = import.meta.env.VITE_API_URL || '/api/v1/auth';

  // Handle Google OAuth redirect token and verifiedEmail
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const errorParam = urlParams.get('error');
    const errorDetails = urlParams.get('details');
    const verifiedEmail = urlParams.get('verifiedEmail');

    const handleGoogleToken = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        await googleLogin(token); // Call AuthContext function
        setMessage('Google login successful!');
        // Clean URL to prevent 404 on refresh
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        navigate('/dashboard');
      } catch (err) {
        console.error('Google login error:', err);
        setError(err.message || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    };

    if (errorParam === 'google_auth_failed') {
      setError(
        `Google login failed: ${decodeURIComponent(
          errorDetails || 'Please try again or use email/password.'
        )}`
      );
    } else if (token) {
      handleGoogleToken();
    }

    if (verifiedEmail) {
      setFormData((prev) => ({ ...prev, email: verifiedEmail }));
      setMessage('Email verified! You can now log in.');
    }
  }, [navigate, setError, googleLogin]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage('');

    try {
      await login(formData);
      setMessage('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        {authError && <p className="error-message">{authError}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-wrapper">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-with-icon"
              placeholder="Email"
              required
              autoComplete="email"
            />
          </div>

          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-with-icon"
              placeholder="Password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 inline mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="forgot-password-link">
          <a href="/forgot-password" className="forgot-password-btn">
            Forgot password?
          </a>
        </div>

        <div className="divider-with-text">or</div>

        <div className="social-buttons">
          <button
            onClick={() => {
              window.location.href = `${baseApiUrl}/google`;
            }}
            disabled={isLoading}
            className={`social-button google ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Sign in with Google"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.4v3.2h5.76c-.24 1.28-1.76 3.76-5.76 3.76-3.44 0-6.24-2.88-6.24-6.4s2.8-6.4 6.24-6.4c1.6 0 3.04.64 4.08 1.68l2.88-2.88C16.8 1.36 14.64 0 12.24 0 6.64 0 2.4 4.24 2.4 9.6s4.24 9.6 9.84 9.6c5.76 0 9.6-4.08 9.6-9.6 0-.64-.08-1.28-.24-1.92h-9.36z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
