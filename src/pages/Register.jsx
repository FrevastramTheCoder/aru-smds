
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { User, Mail, Lock } from 'lucide-react';

// function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//     setSuccess('');
//     setValidationErrors([]);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await register(formData.username, formData.email, formData.password);
//       setSuccess('Registration successful! Please check your email to verify your account.');
//       setFormData({ username: '', email: '', password: '' });

//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     } catch (err) {
//       if (err.errors) {
//         setValidationErrors(err.errors);
//       } else {
//         setError(err.error || 'Registration failed');
//       }
//     }
//   };

//   return (
//     <div className="register-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//       <div className="register-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h1 className="register-header text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
//           Register
//         </h1>

//         {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

//         {validationErrors.length > 0 && (
//           <ul className="text-red-500 mb-4 list-disc list-inside">
//             {validationErrors.map((err, index) => (
//               <li key={index}>{err.msg}</li>
//             ))}
//           </ul>
//         )}

//         <form className="register-form" onSubmit={handleRegister}>
//           <div className="input-wrapper mb-4 relative">
//             <User className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleInputChange}
//               className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
//               placeholder="Username"
//               required
//             />
//           </div>
//           <div className="input-wrapper mb-4 relative">
//             <Mail className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
//               placeholder="Email"
//               required
//             />
//           </div>
//           <div className="input-wrapper mb-4 relative">
//             <Lock className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
//               placeholder="Password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="btn-primary bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
//           >
//             Register
//           </button>
//           <div className="register-footer mt-4 text-center">
//             <p>
//               Already have an account?{' '}
//               <a href="/login" className="text-blue-500 hover:underline">
//                 Login
//               </a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // export default Register;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { User, Mail, Lock } from 'lucide-react';

// function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//     setSuccess('');
//     setValidationErrors([]);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Registering with:', formData);
//       console.log('Request URL:', `${import.meta.env.VITE_API_URL}/register`);
//       await register(formData.username, formData.email, formData.password);
//       setSuccess('Registration successful! Please check your email to verify your account.');
//       setFormData({ username: '', email: '', password: '' });
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     } catch (err) {
//       console.error('Registration error:', err);
//       if (err.response?.errors) {
//         setValidationErrors(err.response.errors);
//       } else {
//         const errorMessage =
//           err.response?.error === 'Email already registered'
//             ? 'This email is already registered. Please use a different email or log in.'
//             : err.response?.error || 'Registration failed';
//         setError(errorMessage);
//       }
//     }
//   };

//   return (
//     <div className="register-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//       <div className="register-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h1 className="register-header text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
//           Register
//         </h1>

//         {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

//         {validationErrors.length > 0 && (
//           <ul className="text-red-500 mb-4 list-disc list-inside">
//             {validationErrors.map((err, index) => (
//               <li key={index}>{err.msg}</li>
//             ))}
//           </ul>
//         )}

//         <form className="register-form" onSubmit={handleRegister}>
//           <div className="input-wrapper mb-4 relative">
//             <User className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleInputChange}
//               className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
//               placeholder="Username"
//               required
//             />
//           </div>
//           <div className="input-wrapper mb-4 relative">
//             <Mail className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
//               placeholder="Email"
//               required
//             />
//           </div>
//           <div className="input-wrapper mb-4 relative">
//             <Lock className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
//               placeholder="Password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="btn-primary bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
//           >
//             Register
//           </button>
//           <div className="register-footer mt-4 text-center">
//             <p>
//               Already have an account?{' '}
//               <a href="/login" className="text-blue-500 hover:underline">
//                 Login
//               </a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;

// testing 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [testResponse, setTestResponse] = useState(null); // For inline test button
  const [testError, setTestError] = useState(null);       // For inline test button

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setValidationErrors([]);
    setTestResponse(null);
    setTestError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Registering with:', formData);
      console.log('Request URL:', `${import.meta.env.VITE_API_URL}/register`);
      await register(formData.username, formData.email, formData.password);
      setSuccess('Registration successful! Please check your email to verify your account.');
      setFormData({ username: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.errors) {
        setValidationErrors(err.response.errors);
      } else {
        const errorMessage =
          err.response?.error === 'Email already registered'
            ? 'This email is already registered. Please use a different email or log in.'
            : err.response?.error || 'Registration failed';
        setError(errorMessage);
      }
    }
  };

  // --- Inline Minimal API Test (bypass AuthContext) ---
  const handleTestRegister = async () => {
    setTestError(null);
    setTestResponse(null);
    try {
      const uniqueEmail = `testuser${Date.now()}@example.com`; // unique to avoid duplication
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: uniqueEmail,
          password: 'testpass123',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setTestResponse(data);
    } catch (error) {
      setTestError(error.message);
    }
  };

  return (
    <div className="register-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="register-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="register-header text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Register
        </h1>

        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {validationErrors.length > 0 && (
          <ul className="text-red-500 mb-4 list-disc list-inside">
            {validationErrors.map((err, index) => (
              <li key={index}>{err.msg}</li>
            ))}
          </ul>
        )}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-wrapper mb-4 relative">
            <User className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
              placeholder="Username"
              required
            />
          </div>
          <div className="input-wrapper mb-4 relative">
            <Mail className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
              placeholder="Email"
              required
            />
          </div>
          <div className="input-wrapper mb-4 relative">
            <Lock className="input-icon w-5 h-5 text-gray-500 absolute left-3 top-3" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-with-icon border p-2 rounded w-full pl-10 dark:bg-gray-700 dark:text-white"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Register
          </button>
          <div className="register-footer mt-4 text-center">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>

        {/* --- Inline API Test Button Section --- */}
        <div className="mt-8 border-t pt-6 text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick API Test</h2>
          <button
            onClick={handleTestRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Test Register API (with unique email)
          </button>
          {testResponse && (
            <pre className="mt-4 text-left text-green-700 bg-green-100 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(testResponse, null, 2)}
            </pre>
          )}
          {testError && (
            <pre className="mt-4 text-left text-red-700 bg-red-100 p-3 rounded overflow-auto max-h-40">
              {testError}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
