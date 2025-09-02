
// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true; // prevent setState on unmounted component

//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');
//     const error = params.get('error');

//     if (error) {
//       if (isMounted) {
//         setError(error);
//         setLoading(false);
//       }
//       setTimeout(() => {
//         if (isMounted) navigate('/login');
//       }, 3000);
//       return;
//     }

//     if (token) {
//       googleLogin(token)
//         .then(() => {
//           if (isMounted) {
//             setLoading(false);
//             // Navigate in next tick to avoid rendering issues
//             setTimeout(() => navigate('/dashboard'), 500);
//           }
//         })
//         .catch((err) => {
//           if (isMounted) {
//             setError(err.message || 'Google login failed');
//             setLoading(false);
//             setTimeout(() => navigate('/login'), 3000);
//           }
//         });
//     } else {
//       if (isMounted) {
//         setError('No token received.');
//         setLoading(false);
//         setTimeout(() => navigate('/login'), 3000);
//       }
//     }

//     return () => {
//       isMounted = false; // cleanup flag
//     };
//     // Run only on mount, avoid googleLogin and setError in deps to prevent infinite loops
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.search, navigate]);

//   return (
//     <div className="auth-loading" style={{ textAlign: 'center', marginTop: '2rem' }}>
//       <Loader2 className="animate-spin" size={48} />
//       <p>{loading ? 'Signing you in...' : 'Redirecting...'}</p>
//     </div>
//   );
// }
// src/pages/GoogleAuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import jwtDecode from 'jwt-decode'; // optional: decode JWT

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin, setError } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    let isMounted = true;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      if (isMounted) setError(error);
      setMessage(`Error: ${error}. Redirecting to login...`);
      setLoading(false);
      setTimeout(() => { if (isMounted) navigate('/login'); }, 3000);
      return;
    }

    if (token) {
      try {
        const user = jwtDecode(token);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.warn('Invalid JWT token:', err);
      }

      googleLogin(token)
        .then(() => {
          if (isMounted) {
            localStorage.setItem('token', token);
            setMessage('Login successful! Redirecting...');
            setLoading(false);
            setTimeout(() => navigate('/dashboard'), 500);
          }
        })
        .catch((err) => {
          if (isMounted) {
            const msg = err.message || 'Google login failed';
            setError(msg);
            setMessage(`Error: ${msg}. Redirecting to login...`);
            setLoading(false);
            setTimeout(() => navigate('/login'), 3000);
          }
        });
    } else {
      if (isMounted) {
        const msg = 'No token received from Google.';
        setError(msg);
        setMessage(msg + ' Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    }

    return () => { isMounted = false; };
  }, [location.search, navigate]);

  return (
    <div className="auth-loading" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Loader2 className="animate-spin" size={48} />
      <p>{message}</p>
    </div>
  );
}
// // src/pages/GoogleAuthCallback.jsx
// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';
// import { jwtDecode } from 'jwt-decode'; // ✅ fixed named import

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('Signing you in...');

//   useEffect(() => {
//     let isMounted = true;

//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');
//     const error = params.get('error');

//     if (error) {
//       if (isMounted) setError(error);
//       setMessage(`Error: ${error}. Redirecting to login...`);
//       setLoading(false);
//       setTimeout(() => { if (isMounted) navigate('/login'); }, 3000);
//       return;
//     }

//     if (token) {
//       try {
//         const user = jwtDecode(token); // ✅ same usage
//         localStorage.setItem('user', JSON.stringify(user));
//       } catch (err) {
//         console.warn('Invalid JWT token:', err);
//       }

//       googleLogin(token)
//         .then(() => {
//           if (isMounted) {
//             localStorage.setItem('token', token);
//             setMessage('Login successful! Redirecting...');
//             setLoading(false);
//             setTimeout(() => navigate('/dashboard'), 500);
//           }
//         })
//         .catch((err) => {
//           if (isMounted) {
//             const msg = err.message || 'Google login failed';
//             setError(msg);
//             setMessage(`Error: ${msg}. Redirecting to login...`);
//             setLoading(false);
//             setTimeout(() => navigate('/login'), 3000);
//           }
//         });
//     } else {
//       if (isMounted) {
//         const msg = 'No token received from Google.';
//         setError(msg);
//         setMessage(msg + ' Redirecting to login...');
//         setLoading(false);
//         setTimeout(() => navigate('/login'), 3000);
//       }
//     }

//     return () => { isMounted = false; };
//   }, [location.search, navigate]);

//   return (
//     <div className="auth-loading" style={{ textAlign: 'center', marginTop: '2rem' }}>
//       <Loader2 className="animate-spin" size={48} />
//       <p>{message}</p>
//     </div>
//   );
// }