
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const baseApiUrl = import.meta.env.VITE_API_URL;
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // On mount, check for token and user in localStorage
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');
//     if (token && userStr) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userStr));
//     }
//     setIsLoading(false);
//   }, []);

//   // Normal login method (email/password)
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
//         console.warn(`Login attempt ${attempt} failed: ${error.message}`);
//         if (attempt < retries) {
//           await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
//         }
//       }
//     }
//     console.error('Login fetch error:', lastError.message);
//     setError(lastError.response?.details || lastError.message);
//     throw lastError;
//   };

//   // Google login method — receives token from backend redirect, validates and stores
//   const googleLogin = async (token) => {
//     if (!token) {
//       throw new Error('No token provided');
//     }
//     // Save token
//     localStorage.setItem('token', token);

//     // Decode user info from JWT token (naive base64 decode, no verification here)
//     try {
//       const base64Payload = token.split('.')[1];
//       const payload = JSON.parse(atob(base64Payload));
//       const userFromToken = {
//         google_id: payload.id || payload.sub, // Google often uses 'sub' as user id
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
//       setIsAuthenticated(false);
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
//   };

//   return (
//     <AuthContext.Provider value={{
//       login,
//       googleLogin,
//       logout,
//       isAuthenticated,
//       user,
//       isLoading,
//       error,
//       setError,
//       setIsAuthenticated,
//       setUser,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// // }
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const baseApiUrl = import.meta.env.VITE_API_URL;
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');
//     if (token && userStr) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userStr));
//     }
//     setIsLoading(false);
//   }, []);

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
//         }
//         setError(null);
//         return data;
//       } catch (error) {
//         lastError = error;
//         console.warn(`Register attempt ${attempt} failed: ${error.message}`);
//         // Skip retries for 400 errors
//         if (error.response?.status === 400) {
//           console.log('Skipping retries for 400 Bad Request error');
//           throw error;
//         }
//         if (attempt < retries) {
//           await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
//         }
//       }
//     }
//     console.error('Register fetch error:', lastError.message);
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
//         console.warn(`Login attempt ${attempt} failed: ${error.message}`);
//         if (attempt < retries) {
//           await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
//         }
//       }
//     }
//     console.error('Login fetch error:', lastError.message);
//     setError(lastError.response?.details || lastError.message);
//     throw lastError;
//   };

//   const googleLogin = async (token) => {
//     if (!token) {
//       throw new Error('No token provided');
//     }
//     localStorage.setItem('token', token);
//     try {
//       const base64Payload = token.split('.')[1];
//       const payload = JSON.parse(atob(base64Payload));
//       const userFromToken = {
//         google_id: payload.id || payload.sub,
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
//       setIsAuthenticated(false);
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
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
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   // Use fallback to relative path in dev environment
//   const baseApiUrl = import.meta.env.VITE_API_URL || '/api/v1/auth';

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');
//     if (token && userStr) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userStr));
//     }
//     setIsLoading(false);
//   }, []);

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
//         }
//         setError(null);
//         return data;
//       } catch (error) {
//         lastError = error;
//         console.warn(`Register attempt ${attempt} failed: ${error.message}`);
//         if (error.response?.status === 400) {
//           console.log('Skipping retries for 400 Bad Request error');
//           throw error;
//         }
//         if (attempt < retries) {
//           await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
//         }
//       }
//     }
//     console.error('Register fetch error:', lastError.message);
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
//         console.warn(`Login attempt ${attempt} failed: ${error.message}`);
//         if (attempt < retries) {
//           await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
//         }
//       }
//     }
//     console.error('Login fetch error:', lastError.message);
//     setError(lastError.response?.details || lastError.message);
//     throw lastError;
//   };

//   const googleLogin = async (token) => {
//     if (!token) {
//       throw new Error('No token provided');
//     }
//     localStorage.setItem('token', token);
//     try {
//       const base64Payload = token.split('.')[1];
//       const payload = JSON.parse(atob(base64Payload));
//       const userFromToken = {
//         google_id: payload.id || payload.sub,
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
//       setIsAuthenticated(false);
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//     setError(null);
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
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const baseApiUrl = import.meta.env.VITE_API_URL || '/api/v1/auth';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logout helper
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const payload = parseJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userStr));
      } else {
        // Token expired
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  // Auto refresh token before expiry
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const expiresInMs = payload.exp * 1000 - Date.now() - 60000; // 1 min before expire
    if (expiresInMs <= 0) {
      logout();
      return;
    }

    const refreshTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`${baseApiUrl}/refresh`, {
          method: 'POST',
          credentials: 'include', // send cookies for refresh token
        });
        const data = await res.json();
        if (res.ok && data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          setIsAuthenticated(true);
          setError(null);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }, expiresInMs);

    return () => clearTimeout(refreshTimeout);
  }, [user, baseApiUrl, logout]);

  const register = async (username, email, password, retries = 3) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${baseApiUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
          const error = new Error(data.error || 'Registration failed');
          error.response = data;
          throw error;
        }
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthenticated(true);
          setUser(data.user);
          setError(null);
        }
        return data;
      } catch (error) {
        lastError = error;
        if (error.response?.status === 400) throw error;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
    setError(lastError.response?.error || lastError.message);
    throw lastError;
  };

  const login = async (formData, retries = 3) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${baseApiUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
          const error = new Error(data.error || 'Login failed');
          error.response = data;
          throw error;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        setError(null);
        return data;
      } catch (error) {
        lastError = error;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
    setError(lastError.response?.details || lastError.message);
    throw lastError;
  };

  const googleLogin = async (token) => {
    if (!token) throw new Error('No token provided');
    localStorage.setItem('token', token);
    try {
      const payload = parseJwt(token);
      if (!payload) throw new Error('Invalid token format');
      const userFromToken = {
        google_id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
      };
      setUser(userFromToken);
      localStorage.setItem('user', JSON.stringify(userFromToken));
      setIsAuthenticated(true);
      setError(null);
      return { token, user: userFromToken };
    } catch (err) {
      setError('Invalid token format');
      logout();
      throw err;
    }
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
