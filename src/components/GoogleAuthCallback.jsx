// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [message, setMessage] = useState('Signing you in...');

//   useEffect(() => {
//     let isMounted = true;
//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');
//     const error = params.get('error');

//     if (error) {
//       if (isMounted) setError(error);
//       setMessage(`Error: ${error}. Redirecting to login...`);
//       setTimeout(() => isMounted && navigate('/login'), 3000);
//       return;
//     }

//     if (!token) {
//       const msg = 'No token received from Google.';
//       if (isMounted) setError(msg);
//       setMessage(msg + ' Redirecting to login...');
//       setTimeout(() => isMounted && navigate('/login'), 3000);
//       return;
//     }

//     (async () => {
//       try {
//         const jwtDecode = (await import('jwt-decode')).default;
//         const user = jwtDecode(token);
//         localStorage.setItem('user', JSON.stringify(user));
//       } catch (err) {
//         console.warn('Invalid JWT token:', err);
//       }

//       googleLogin(token)
//         .then(() => {
//           if (isMounted) {
//             localStorage.setItem('token', token);
//             setMessage('Login successful! Redirecting...');
//             setTimeout(() => navigate('/dashboard'), 500);
//           }
//         })
//         .catch((err) => {
//           const msg = err.message || 'Google login failed';
//           if (isMounted) setError(msg);
//           setMessage(`Error: ${msg}. Redirecting to login...`);
//           setTimeout(() => isMounted && navigate('/login'), 3000);
//         });
//     })();

//     return () => { isMounted = false; };
//   }, [location.search, navigate, googleLogin, setError]);

//   return (
//     <div className="auth-loading" style={{ textAlign: 'center', marginTop: '2rem' }}>
//       <Loader2 className="animate-spin" size={48} />
//       <p>{message}</p>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

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
      if (isMounted) {
        setError(decodeURIComponent(error));
        setMessage(`Error: ${decodeURIComponent(error)}. Redirecting to login...`);
        setLoading(false);
        setTimeout(() => isMounted && navigate('/login'), 3000);
      }
      return;
    }

    if (!token) {
      const msg = 'No token received from Google.';
      if (isMounted) {
        setError(msg);
        setMessage(`${msg} Redirecting to login...`);
        setLoading(false);
        setTimeout(() => isMounted && navigate('/login'), 3000);
      }
      return;
    }

    (async () => {
      try {
        await googleLogin(token);
        if (isMounted) {
          setMessage('Login successful! Redirecting...');
          setLoading(false);
          setTimeout(() => isMounted && navigate('/dashboard'), 500);
        }
      } catch (err) {
        console.error('Google login error:', err);
        const msg = err.message || 'Google login failed';
        if (isMounted) {
          setError(msg);
          setMessage(`Error: ${msg}. Redirecting to login...`);
          setLoading(false);
          setTimeout(() => isMounted && navigate('/login'), 3000);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, googleLogin, setError]);

  return (
    <div className="auth-loading" style={{ textAlign: 'center', marginTop: '2rem' }}>
      {loading && <Loader2 className="animate-spin" size={48} />}
      <p>{message}</p>
    </div>
  );
}