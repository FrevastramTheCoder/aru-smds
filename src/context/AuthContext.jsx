// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const AuthContext = createContext();

// // ✅ Parse JWT token
// function parseJwt(token) {
//   try {
//     const base64Payload = token.split('.')[1];
//     return JSON.parse(atob(base64Payload));
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   // ✅ Use backend-sp9b Render API for auth
//   const AUTH_API_BASE = (import.meta.env.VITE_API_AUTH_URL || "https://backend-sp9b.onrender.com/api/v1/auth").replace(/\/$/, "");

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Logout
//   const logout = useCallback(() => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
//   }, []);

//   // ✅ Load auth state from localStorage on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');

//     if (token && userStr) {
//       const payload = parseJwt(token);
//       if (payload && payload.exp * 1000 > Date.now()) {
//         setIsAuthenticated(true);
//         setUser(JSON.parse(userStr));
//       } else {
//         logout();
//       }
//     }
//     setIsLoading(false);
//   }, [logout]);

//   // ✅ Auto-refresh token 1 min before expiry
//   useEffect(() => {
//     if (!user) return;
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const payload = parseJwt(token);
//     if (!payload?.exp) return;

//     const expiresInMs = payload.exp * 1000 - Date.now() - 60000;
//     if (expiresInMs <= 0) {
//       logout();
//       return;
//     }

//     const refreshTimeout = setTimeout(async () => {
//       try {
//         const res = await fetch(`${AUTH_API_BASE}/refresh`, {
//           method: 'POST',
//           credentials: 'include',
//         });
//         const data = await res.json();
//         if (res.ok && data.token && data.user) {
//           localStorage.setItem('token', data.token);
//           localStorage.setItem('user', JSON.stringify(data.user));
//           setUser(data.user);
//           setIsAuthenticated(true);
//           setError(null);
//         } else {
//           logout();
//         }
//       } catch {
//         logout();
//       }
//     }, expiresInMs);

//     return () => clearTimeout(refreshTimeout);
//   }, [user, AUTH_API_BASE, logout]);

//   // ✅ Register
//   const register = async (username, email, password, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const res = await fetch(`${AUTH_API_BASE}/register`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username, email, password }),
//           credentials: 'include',
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Registration failed');

//         if (data.token && data.user) {
//           localStorage.setItem('token', data.token);
//           localStorage.setItem('user', JSON.stringify(data.user));
//           setIsAuthenticated(true);
//           setUser(data.user);
//           setError(null);
//         }
//         return data;
//       } catch (err) {
//         lastError = err;
//         if (attempt < retries) await new Promise((r) => setTimeout(r, 2000 * attempt));
//       }
//     }
//     setError(lastError.message);
//     throw lastError;
//   };

//   // ✅ Login
//   const login = async (formData, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const res = await fetch(`${AUTH_API_BASE}/login`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData),
//           credentials: 'include',
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Login failed');

//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         setIsAuthenticated(true);
//         setUser(data.user);
//         setError(null);
//         return data;
//       } catch (err) {
//         lastError = err;
//         if (attempt < retries) await new Promise((r) => setTimeout(r, 2000 * attempt));
//       }
//     }
//     setError(lastError.message);
//     throw lastError;
//   };

//   // ✅ Google login
//   const googleLogin = async (token) => {
//     if (!token) throw new Error('No token provided');
//     try {
//       const payload = parseJwt(token);
//       if (!payload) throw new Error('Invalid token');

//       const userFromToken = {
//         google_id: payload.sub || payload.id,
//         email: payload.email,
//         name: payload.name,
//       };

//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userFromToken));
//       setUser(userFromToken);
//       setIsAuthenticated(true);
//       setError(null);
//       return { token, user: userFromToken };
//     } catch (err) {
//       setError('Invalid token format');
//       logout();
//       throw err;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         register,
//         login,
//         googleLogin,
//         logout,
//         isAuthenticated,
//         user,
//         isLoading,
//         error,
//         setError,
//         setIsAuthenticated,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ✅ Custom hook
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// }
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// ✅ AuthProvider bypasses backend
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // always logged in
  const [user, setUser] = useState({ name: 'Bypass User', email: 'bypass@example.com' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
    setUser({ name: 'Bypass User', email: 'bypass@example.com' });
    return { user };
  };

  const googleLogin = async () => {
    setIsAuthenticated(true);
    setUser({ name: 'Bypass User', email: 'bypass@example.com' });
    return { user };
  };

  const register = async () => ({ user });

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        googleLogin,
        logout,
        isAuthenticated,
        user,
        isLoading,
        error,
        setError,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
