
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

// export default Register;
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
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setValidationErrors([]);
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
      </div>
    </div>
  );
}

export default Register;
