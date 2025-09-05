// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// // ✅ Auth API base
// const AUTH_API_BASE = (import.meta.env.VITE_API_AUTH_URL || "https://backend-sp9b.onrender.com/api/v1/auth").replace(/\/$/, "");

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

//       // ✅ Perform login using Google token
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
// // }
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Loader2 } from "lucide-react";

// // ✅ Auth API base
// const AUTH_API_BASE = (
//   import.meta.env.VITE_API_AUTH_URL ||
//   "https://backend-sp9b.onrender.com/api/v1/auth"
// ).replace(/\/$/, "");

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [message, setMessage] = useState("Signing you in...");

//   useEffect(() => {
//     let isMounted = true;
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     const error = params.get("error");

//     if (error) {
//       if (isMounted) setError(error);
//       setMessage(`Error: ${error}. Redirecting to login...`);
//       setTimeout(() => isMounted && navigate("/login"), 3000);
//       return;
//     }

//     if (!token) {
//       const msg = "No token received from Google.";
//       if (isMounted) setError(msg);
//       setMessage(msg + " Redirecting to login...");
//       setTimeout(() => isMounted && navigate("/login"), 3000);
//       return;
//     }

//     (async () => {
//       try {
//         const jwtDecode = (await import("jwt-decode")).default;
//         const user = jwtDecode(token);
//         localStorage.setItem("user", JSON.stringify(user));
//       } catch (err) {
//         console.warn("Invalid JWT token:", err);
//       }

//       googleLogin(token)
//         .then(() => {
//           if (isMounted) {
//             localStorage.setItem("token", token);
//             setMessage("Login successful! Redirecting...");
//             setTimeout(() => navigate("/dashboard"), 500);
//           }
//         })
//         .catch((err) => {
//           const msg = err.message || "Google login failed";
//           if (isMounted) setError(msg);
//           setMessage(`Error: ${msg}. Redirecting to login...`);
//           setTimeout(() => isMounted && navigate("/login"), 3000);
//         });
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [location.search, navigate, googleLogin, setError]);

//   return (
//     <div className="auth-loading" style={{ textAlign: "center", marginTop: "2rem" }}>
//       <Loader2 className="animate-spin" size={48} />
//       <p>{message}</p>
//     </div>
//   );
// // }
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Loader2 } from "lucide-react";

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [message, setMessage] = useState("Signing you in...");

//   useEffect(() => {
//     let isMounted = true;
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     const error = params.get("error");

//     if (error) {
//       if (isMounted) setError(error);
//       setMessage(`Error: ${error}. Redirecting to login...`);
//       setTimeout(() => isMounted && navigate("/login"), 3000);
//       return;
//     }

//     if (!token) {
//       const msg = "No token received from Google.";
//       if (isMounted) setError(msg);
//       setMessage(msg + " Redirecting to login...");
//       setTimeout(() => isMounted && navigate("/login"), 3000);
//       return;
//     }

//     (async () => {
//       try {
//         await googleLogin(token);

//         // Clean the URL
//         const cleanUrl = window.location.origin + window.location.pathname;
//         window.history.replaceState({}, document.title, cleanUrl);

//         if (isMounted) {
//           setMessage("Login successful! Redirecting...");
//           setTimeout(() => navigate("/dashboard"), 500);
//         }
//       } catch (err) {
//         const msg = err.message || "Google login failed";
//         if (isMounted) setError(msg);
//         setMessage(`Error: ${msg}. Redirecting to login...`);
//         setTimeout(() => isMounted && navigate("/login"), 3000);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [location.search, navigate, googleLogin, setError]);

//   return (
//     <div style={{ textAlign: "center", marginTop: "2rem" }}>
//       <Loader2 className="animate-spin" size={48} />
//       <p>{message}</p>
//     </div>
//   );
// // }
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Loader2 } from "lucide-react";

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [message, setMessage] = useState("Signing you in...");

//   useEffect(() => {
//     let isMounted = true;

//     const handleGoogleLogin = async () => {
//       try {
//         const params = new URLSearchParams(location.search);
//         const token = params.get("token");
//         const error = params.get("error");

//         // ❌ Handle OAuth errors
//         if (error) {
//           if (isMounted) setError(error);
//           setMessage(`Error: ${error}. Redirecting to login...`);
//           setTimeout(() => isMounted && navigate("/login"), 3000);
//           return;
//         }

//         // ❌ No token received
//         if (!token) {
//           const msg = "No token received from Google.";
//           if (isMounted) setError(msg);
//           setMessage(msg + " Redirecting to login...");
//           setTimeout(() => isMounted && navigate("/login"), 3000);
//           return;
//         }

//         // ✅ Perform Google login via AuthContext
//         const { user } = await googleLogin(token);
//         if (isMounted) setMessage(`Welcome, ${user.name}! Redirecting...`);

//         // 🔹 Clean the URL to remove token and query params
//         const cleanUrl = window.location.origin + window.location.pathname;
//         window.history.replaceState({}, document.title, cleanUrl);

//         // 🔹 Redirect to dashboard
//         setTimeout(() => isMounted && navigate("/dashboard"), 500);
//       } catch (err) {
//         const msg = err.message || "Google login failed";
//         if (isMounted) setError(msg);
//         setMessage(`Error: ${msg}. Redirecting to login...`);
//         setTimeout(() => isMounted && navigate("/login"), 3000);
//       }
//     };

//     handleGoogleLogin();

//     return () => {
//       isMounted = false;
//     };
//   }, [location.search, navigate, googleLogin, setError]);

//   return (
//     <div
//       style={{
//         textAlign: "center",
//         marginTop: "2rem",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: "1rem",
//       }}
//     >
//       <Loader2 className="animate-spin" size={48} />
//       <p>{message}</p>
//     </div>
//   );
// // }
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Loader2 } from "lucide-react";

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError } = useAuth();
//   const [message, setMessage] = useState("Signing you in...");

//   useEffect(() => {
//     let isMounted = true;

//     const handleGoogleLogin = async () => {
//       try {
//         const params = new URLSearchParams(location.search);
//         const token = params.get("token");
//         const error = params.get("error");

//         if (error) {
//           if (isMounted) setError(error);
//           setMessage(`Error: ${error}. Redirecting...`);
//           return setTimeout(() => isMounted && navigate("/login"), 3000);
//         }

//         if (!token) {
//           const msg = "No token received from Google.";
//           if (isMounted) setError(msg);
//           setMessage(msg);
//           return setTimeout(() => isMounted && navigate("/login"), 3000);
//         }

//         const { user } = await googleLogin(token);
//         if (isMounted) setMessage(`Welcome, ${user.name}! Redirecting...`);

//         // Clean URL
//         const cleanUrl = window.location.origin + window.location.pathname;
//         window.history.replaceState({}, document.title, cleanUrl);

//         setTimeout(() => isMounted && navigate("/dashboard"), 500);
//       } catch (err) {
//         const msg = err.message || "Google login failed";
//         if (isMounted) setError(msg);
//         setMessage(`Error: ${msg}. Redirecting...`);
//         setTimeout(() => isMounted && navigate("/login"), 3000);
//       }
//     };

//     handleGoogleLogin();
//     return () => { isMounted = false; };
//   }, [location.search, navigate, googleLogin, setError]);

//   return (
//     <div style={{ textAlign: "center", marginTop: "2rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
//       <Loader2 className="animate-spin" size={48} />
//       <p>{message}</p>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin, setError } = useAuth();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    let isMounted = true;

    const handleGoogleLogin = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error) {
          if (isMounted) setError(error);
          setMessage(`Error: ${error}. Redirecting...`);
          return setTimeout(() => isMounted && navigate("/login"), 3000);
        }

        if (!token) {
          const msg = "No token received from Google.";
          if (isMounted) setError(msg);
          setMessage(msg);
          return setTimeout(() => isMounted && navigate("/login"), 3000);
        }

        const { user } = await googleLogin(token);
        if (isMounted) setMessage(`Welcome, ${user.name}! Redirecting...`);

        // Clean URL (remove token from browser)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        setTimeout(() => isMounted && navigate("/dashboard"), 500);
      } catch (err) {
        const msg = err.message || "Google login failed";
        if (isMounted) setError(msg);
        setMessage(`Error: ${msg}. Redirecting...`);
        setTimeout(() => isMounted && navigate("/login"), 3000);
      }
    };

    handleGoogleLogin();
    return () => { isMounted = false; };
  }, [location.search, navigate, googleLogin, setError]);

  return (
    <div style={{
      textAlign: "center",
      marginTop: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    }}>
      <Loader2 className="animate-spin" size={48} />
      <p>{message}</p>
    </div>
  );
}
