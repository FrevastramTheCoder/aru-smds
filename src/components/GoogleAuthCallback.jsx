import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

// ✅ Auth API base (fallback for safety)
const AUTH_API_BASE = (
  import.meta.env.VITE_API_AUTH_URL ||
  "https://backend-sp9b.onrender.com/api/v1/auth"
).replace(/\/$/, "");

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin, setError } = useAuth();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    // ✅ Handle error from backend
    if (error) {
      if (isMounted) setError(error);
      setMessage(`Error: ${error}. Redirecting to login...`);
      setTimeout(() => isMounted && navigate("/login"), 3000);
      return;
    }

    // ✅ No token case
    if (!token) {
      const msg = "No token received from Google.";
      if (isMounted) setError(msg);
      setMessage(msg + " Redirecting to login...");
      setTimeout(() => isMounted && navigate("/login"), 3000);
      return;
    }

    // ✅ Decode and store token + login
    (async () => {
      try {
        const jwtDecode = (await import("jwt-decode")).default;
        const user = jwtDecode(token);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.warn("Invalid JWT token:", err);
      }

      googleLogin(token)
        .then(() => {
          if (isMounted) {
            setMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 500);
          }
        })
        .catch((err) => {
          const msg = err.message || "Google login failed";
          if (isMounted) setError(msg);
          setMessage(`Error: ${msg}. Redirecting to login...`);
          setTimeout(() => isMounted && navigate("/login"), 3000);
        });
    })();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, googleLogin, setError]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center"
    >
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
