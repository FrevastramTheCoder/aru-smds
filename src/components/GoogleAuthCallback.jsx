
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Loader2 } from "lucide-react";

// export default function GoogleAuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { googleLogin, setError, setUser } = useAuth();
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

//         // Step 1: Store token locally via AuthContext
//         await googleLogin(token);

//         // Step 2: Validate token with backend
//         const res = await fetch("/api/v1/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           const msg = `Token validation failed: ${res.statusText}`;
//           if (isMounted) setError(msg);
//           setMessage(`Error: ${msg}. Redirecting...`);
//           return setTimeout(() => isMounted && navigate("/login"), 3000);
//         }

//         const userData = await res.json();
//         if (isMounted) {
//           setUser(userData); // Store user info in context
//           setMessage(`Welcome, ${userData.name}! Redirecting...`);
//         }

//         // Step 3: Clean URL (remove token from browser)
//         const cleanUrl = window.location.origin + window.location.pathname;
//         window.history.replaceState({}, document.title, cleanUrl);

//         // Step 4: Redirect to dashboard
//         setTimeout(() => isMounted && navigate("/dashboard"), 500);
//       } catch (err) {
//         const msg = err.message || "Google login failed";
//         if (isMounted) setError(msg);
//         setMessage(`Error: ${msg}. Redirecting...`);
//         setTimeout(() => isMounted && navigate("/login"), 3000);
//       }
//     };

//     handleGoogleLogin();

//     return () => {
//       isMounted = false;
//     };
//   }, [location.search, navigate, googleLogin, setError, setUser]);

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
// }

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin, setError, setUser } = useAuth();
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

        // Step 1: Store token locally via AuthContext
        await googleLogin(token);

        // Step 2: Validate token with backend
        const res = await fetch("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const msg = `Token validation failed: ${res.statusText}`;
          if (isMounted) setError(msg);
          setMessage(`Error: ${msg}. Redirecting...`);
          return setTimeout(() => isMounted && navigate("/login"), 3000);
        }

        const userData = await res.json();
        if (isMounted) {
          setUser(userData);
          setMessage(`Welcome, ${userData.name}! Redirecting...`);
        }

        // Step 3: Clean URL (remove token from browser)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        // Step 4: Redirect to dashboard
        setTimeout(() => isMounted && navigate("/dashboard"), 500);
      } catch (err) {
        const msg = err.message || "Google login failed";
        if (isMounted) setError(msg);
        setMessage(`Error: ${msg}. Redirecting...`);
        setTimeout(() => isMounted && navigate("/login"), 3000);
      }
    };

    handleGoogleLogin();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, googleLogin, setError, setUser]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen text-center">
      <Loader2 className="animate-spin h-12 w-12 text-gray-600" />
      <p>{message}</p>
    </div>
  );
}
