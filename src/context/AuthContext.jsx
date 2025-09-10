
// //corrected
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     const base64Payload = token.split('.')[1];
//     const payload = JSON.parse(atob(base64Payload));
//     return payload;
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const baseApiUrl = import.meta.env.VITE_API_URL || '/api/v1/auth';

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Logout helper
//   const logout = useCallback(() => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
//   }, []);

//   // Load auth state from localStorage on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');
//     if (token && userStr) {
//       const payload = parseJwt(token);
//       if (payload && payload.exp * 1000 > Date.now()) {
//         setIsAuthenticated(true);
//         setUser(JSON.parse(userStr));
//       } else {
//         // Token expired
//         logout();
//       }
//     }
//     setIsLoading(false);
//   }, [logout]);

//   // Auto refresh token before expiry
//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const payload = parseJwt(token);
//     if (!payload?.exp) return;

//     const expiresInMs = payload.exp * 1000 - Date.now() - 60000; // 1 min before expire
//     if (expiresInMs <= 0) {
//       logout();
//       return;
//     }

//     const refreshTimeout = setTimeout(async () => {
//       try {
//         const res = await fetch(`${baseApiUrl}/refresh`, {
//           method: 'POST',
//           credentials: 'include', // send cookies for refresh token
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
//   }, [user, baseApiUrl, logout]);

//   const register = async (username, email, password, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch(`${baseApiUrl}/register`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username, email, password }),
//           credentials: 'include',
//         });
//         const data = await response.json();
//         if (!response.ok) {
//           const error = new Error(data.error || 'Registration failed');
//           error.response = data;
//           throw error;
//         }
//         if (data.token && data.user) {
//           localStorage.setItem('token', data.token);
//           localStorage.setItem('user', JSON.stringify(data.user));
//           setIsAuthenticated(true);
//           setUser(data.user);
//           setError(null);
//         }
//         return data;
//       } catch (error) {
//         lastError = error;
//         if (error.response?.status === 400) throw error;
//         if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
//       }
//     }
//     setError(lastError.response?.error || lastError.message);
//     throw lastError;
//   };

//   const login = async (formData, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch(`${baseApiUrl}/login`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData),
//           credentials: 'include',
//         });
//         const data = await response.json();
//         if (!response.ok) {
//           const error = new Error(data.error || 'Login failed');
//           error.response = data;
//           throw error;
//         }
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         setIsAuthenticated(true);
//         setUser(data.user);
//         setError(null);
//         return data;
//       } catch (error) {
//         lastError = error;
//         if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
//       }
//     }
//     setError(lastError.response?.details || lastError.message);
//     throw lastError;
//   };

//   const googleLogin = async (token) => {
//     if (!token) throw new Error('No token provided');
//     localStorage.setItem('token', token);
//     try {
//       const payload = parseJwt(token);
//       if (!payload) throw new Error('Invalid token format');
//       const userFromToken = {
//         google_id: payload.sub || payload.id,
//         email: payload.email,
//         name: payload.name,
//       };
//       setUser(userFromToken);
//       localStorage.setItem('user', JSON.stringify(userFromToken));
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

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// }

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";

// const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     const base64Payload = token.split(".")[1];
//     const payload = JSON.parse(atob(base64Payload));
//     return payload;
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const baseApiUrl = import.meta.env.VITE_API_URL || "/api/v1/auth";

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔹 Logout helper
//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
//   }, []);

//   // 🔹 Load auth state from localStorage on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userStr = localStorage.getItem("user");
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

//   // 🔹 Auto refresh token before expiry
//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const payload = parseJwt(token);
//     if (!payload?.exp) return;

//     const expiresInMs = payload.exp * 1000 - Date.now() - 60000; // 1 min before expire
//     if (expiresInMs <= 0) {
//       logout();
//       return;
//     }

//     const refreshTimeout = setTimeout(async () => {
//       try {
//         const res = await fetch(`${baseApiUrl}/refresh`, {
//           method: "POST",
//           credentials: "include", // send cookies for refresh token
//         });
//         const data = await res.json();
//         if (res.ok && data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
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
//   }, [user, baseApiUrl, logout]);

//   // 🔹 Register
//   const register = async (username, email, password, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch(`${baseApiUrl}/register`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, email, password }),
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (!response.ok) {
//           const error = new Error(data.error || "Registration failed");
//           error.response = data;
//           throw error;
//         }
//         if (data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           setIsAuthenticated(true);
//           setUser(data.user);
//           setError(null);
//         }
//         return data;
//       } catch (error) {
//         lastError = error;
//         if (error.response?.status === 400) throw error;
//         if (attempt < retries)
//           await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
//       }
//     }
//     setError(lastError.response?.error || lastError.message);
//     throw lastError;
//   };

//   // 🔹 Login
//   const login = async (formData, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch(`${baseApiUrl}/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (!response.ok) {
//           const error = new Error(data.error || "Login failed");
//           error.response = data;
//           throw error;
//         }
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setIsAuthenticated(true);
//         setUser(data.user);
//         setError(null);
//         return data;
//       } catch (error) {
//         lastError = error;
//         if (attempt < retries)
//           await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
//       }
//     }
//     setError(lastError.response?.details || lastError.message);
//     throw lastError;
//   };

//   // 🔹 Google Login
//   const googleLogin = async (token) => {
//     if (!token) throw new Error("No token provided");
//     localStorage.setItem("token", token);
//     try {
//       const payload = parseJwt(token);
//       if (!payload) throw new Error("Invalid token format");
//       const userFromToken = {
//         google_id: payload.sub || payload.id,
//         email: payload.email,
//         name: payload.name,
//       };
//       setUser(userFromToken);
//       localStorage.setItem("user", JSON.stringify(userFromToken));
//       setIsAuthenticated(true);
//       setError(null);
//       return { token, user: userFromToken };
//     } catch (err) {
//       setError("Invalid token format");
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

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// // }
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     const base64Payload = token.split(".")[1];
//     return JSON.parse(atob(base64Payload));
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const baseApiUrl = import.meta.env.VITE_API_URL || "/api/v1/auth";

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔹 Logout helper
//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
//   }, []);

//   // 🔹 Auto-detect token from URL (Google OAuth callback)
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const tokenFromUrl = params.get("token");
//     if (tokenFromUrl) {
//       localStorage.setItem("token", tokenFromUrl);
//       try {
//         const payload = parseJwt(tokenFromUrl);
//         if (payload) {
//           const userFromToken = {
//             google_id: payload.sub || payload.id,
//             email: payload.email,
//             name: payload.name,
//           };
//           setUser(userFromToken);
//           localStorage.setItem("user", JSON.stringify(userFromToken));
//           setIsAuthenticated(true);
//           setError(null);
//         }
//       } catch {
//         logout();
//       }
//       // Clean the URL
//       const newUrl = window.location.origin + window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);
//     }
//   }, [logout]);

//   // 🔹 Load auth state from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userStr = localStorage.getItem("user");
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

//   // 🔹 Auto refresh token before expiry
//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem("token");
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
//         const res = await fetch(`${baseApiUrl}/refresh`, {
//           method: "POST",
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (res.ok && data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
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
//   }, [user, baseApiUrl, logout]);

//   // 🔹 API fetch wrapper
//   const apiFetch = async (endpoint, options = {}) => {
//     const token = localStorage.getItem("token");
//     const headers = {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     };

//     try {
//       const res = await fetch(`${baseApiUrl}${endpoint}`, {
//         ...options,
//         headers,
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         if (res.status === 401) logout();
//         throw new Error(data.error || "API request failed");
//       }
//       return data;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // 🔹 Register
//   const register = async (username, email, password, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const data = await apiFetch("/register", {
//           method: "POST",
//           body: JSON.stringify({ username, email, password }),
//         });
//         if (data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           setIsAuthenticated(true);
//           setUser(data.user);
//           setError(null);
//         }
//         return data;
//       } catch (err) {
//         lastError = err;
//         if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
//       }
//     }
//     setError(lastError.message);
//     throw lastError;
//   };

//   // 🔹 Login
//   const login = async (formData, retries = 3) => {
//     let lastError;
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const data = await apiFetch("/login", {
//           method: "POST",
//           body: JSON.stringify(formData),
//         });
//         if (data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           setIsAuthenticated(true);
//           setUser(data.user);
//           setError(null);
//         }
//         return data;
//       } catch (err) {
//         lastError = err;
//         if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
//       }
//     }
//     setError(lastError.message);
//     throw lastError;
//   };

//   // 🔹 Google login
//   const googleLogin = async (token) => {
//     if (!token) throw new Error("No token provided");
//     localStorage.setItem("token", token);
//     try {
//       const payload = parseJwt(token);
//       if (!payload) throw new Error("Invalid token format");
//       const userFromToken = {
//         google_id: payload.sub || payload.id,
//         email: payload.email,
//         name: payload.name,
//       };
//       setUser(userFromToken);
//       localStorage.setItem("user", JSON.stringify(userFromToken));
//       setIsAuthenticated(true);
//       setError(null);
//       return { token, user: userFromToken };
//     } catch (err) {
//       setError("Invalid token format");
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
//         apiFetch, // ← new centralized fetch
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

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// // }
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const baseApiUrl = import.meta.env.VITE_API_URL || "/api/v1/auth";

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔹 Logout helper
//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
//   }, []);

//   // 🔹 Load auth state from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userStr = localStorage.getItem("user");
//     if (token && userStr) {
//       const payload = parseJwt(token);
//       if (payload?.exp * 1000 > Date.now()) {
//         setIsAuthenticated(true);
//         setUser(JSON.parse(userStr));
//       } else logout();
//     }
//     setIsLoading(false);
//   }, [logout]);

//   // 🔹 Auto refresh token before expiry
//   useEffect(() => {
//     if (!user) return;
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const payload = parseJwt(token);
//     if (!payload?.exp) return;

//     const expiresInMs = payload.exp * 1000 - Date.now() - 60000; // refresh 1 min before expiry
//     if (expiresInMs <= 0) {
//       logout();
//       return;
//     }

//     const refreshTimeout = setTimeout(async () => {
//       try {
//         const res = await fetch(`${baseApiUrl}/refresh`, {
//           method: "POST",
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (res.ok && data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
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
//   }, [user, baseApiUrl, logout]);

//   // 🔹 Centralized API fetch
//   const apiFetch = async (endpoint, options = {}) => {
//     const token = localStorage.getItem("token");
//     const headers = {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     };
//     try {
//       const res = await fetch(`${baseApiUrl}${endpoint}`, { ...options, headers, credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) {
//         if (res.status === 401) logout();
//         throw new Error(data.error || "API request failed");
//       }
//       return data;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // 🔹 Register
//   const register = async (username, email, password) => {
//     const data = await apiFetch("/register", {
//       method: "POST",
//       body: JSON.stringify({ username, email, password }),
//     });
//     return data;
//   };

//   // 🔹 Login (email/password)
//   const login = async (formData) => {
//     const data = await apiFetch("/login", {
//       method: "POST",
//       body: JSON.stringify(formData),
//     });
//     if (data.token && data.user) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setUser(data.user);
//       setIsAuthenticated(true);
//       setError(null);
//     }
//     return data;
//   };

//   // 🔹 Google Login
//   const googleLogin = async (token) => {
//     if (!token) throw new Error("No token provided");
//     localStorage.setItem("token", token);

//     try {
//       const payload = parseJwt(token);
//       if (!payload) throw new Error("Invalid token format");

//       const u = {
//         google_id: payload.sub || payload.id,
//         email: payload.email,
//         name: payload.name,
//       };
//       setUser(u);
//       localStorage.setItem("user", JSON.stringify(u));
//       setIsAuthenticated(true);
//       setError(null);

//       // 🔹 Setup auto-refresh for Google token
//       const expiresInMs = payload.exp * 1000 - Date.now() - 60000; // 1 min before expiry
//       if (expiresInMs > 0) {
//         setTimeout(async () => {
//           try {
//             const res = await fetch(`${baseApiUrl}/google/refresh`, {
//               method: "POST",
//               credentials: "include",
//             });
//             const data = await res.json();
//             if (res.ok && data.token && data.user) {
//               localStorage.setItem("token", data.token);
//               localStorage.setItem("user", JSON.stringify(data.user));
//               setUser(data.user);
//               setIsAuthenticated(true);
//             } else logout();
//           } catch {
//             logout();
//           }
//         }, expiresInMs);
//       }

//       return { token, user: u };
//     } catch (err) {
//       setError("Invalid token format");
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
//         apiFetch,
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

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// // } old is old
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [error, setError] = useState(null);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setIsAuthenticated(false);
//   }, []);

//   const googleLogin = async (token) => {
//     if (!token) throw new Error("No token provided");
//     localStorage.setItem("token", token);
//     const payload = parseJwt(token);
//     const userData = { id: payload.id, email: payload.email, name: payload.name };
//     setUser(userData);
//     setIsAuthenticated(true);
//     localStorage.setItem("user", JSON.stringify(userData));
//     return { token, user: userData };
//   };

//   return (
//     <AuthContext.Provider value={{ googleLogin, logout, user, isAuthenticated, error, setError }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// // }
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [error, setError] = useState(null);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setIsAuthenticated(false);
//   }, []);

//   const googleLogin = async (token) => {
//     if (!token) throw new Error("No token provided");
//     localStorage.setItem("token", token);
//     const payload = parseJwt(token);
//     if (!payload) throw new Error("Invalid token");
//     const userData = { id: payload.id, email: payload.email, name: payload.name };
//     setUser(userData);
//     setIsAuthenticated(true);
//     localStorage.setItem("user", JSON.stringify(userData));
//     return { token, user: userData };
//   };

//   // Check for existing token on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (token && storedUser) {
//       try {
//         const payload = parseJwt(token);
//         if (payload && payload.exp * 1000 > Date.now()) {
//           setUser(JSON.parse(storedUser));
//           setIsAuthenticated(true);
//         } else {
//           logout(); // Clear expired token
//         }
//       } catch {
//         logout(); // Clear invalid token
//       }
//     }
//   }, [logout]);

//   return (
//     <AuthContext.Provider value={{ googleLogin, logout, user, isAuthenticated, error, setError, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const googleLogin = async (token) => {
    if (!token) throw new Error("No token provided");
    localStorage.setItem("token", token);

    const payload = parseJwt(token);
    if (!payload) throw new Error("Invalid token");

    const userData = { id: payload.id, email: payload.email, name: payload.name };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    return { token, user: userData };
  };

  // Restore auth state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const payload = parseJwt(token);
        if (payload && payload.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          logout(); // Clear expired token
        }
      } catch {
        logout(); // Clear invalid token
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ googleLogin, logout, user, isAuthenticated, error, setError, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
