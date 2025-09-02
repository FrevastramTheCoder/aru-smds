
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
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Added for API calls

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
  const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-sp9b.onrender.com/api/v1/auth';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const payload = parseJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userStr));
      } else {
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const expiresInMs = payload.exp * 1000 - Date.now() - 60000;
    if (expiresInMs <= 0) {
      logout();
      return;
    }

    const refreshTimeout = setTimeout(async () => {
      try {
        const res = await axios.post(`${baseApiUrl}/refresh`, {}, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.status === 200 && res.data.token && res.data.user) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.data.user);
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
        const response = await axios.post(`${baseApiUrl}/register`, {
          username,
          email,
          password,
        }, { withCredentials: true });
        if (response.status === 200 && response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsAuthenticated(true);
          setUser(response.data.user);
          setError(null);
          return response.data;
        }
      } catch (error) {
        lastError = error;
        if (error.response?.status === 400) throw error;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
    setError(lastError.response?.data?.error || lastError.message);
    throw lastError;
  };

  const login = async (formData, retries = 3) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(`${baseApiUrl}/login`, formData, {
          withCredentials: true,
        });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsAuthenticated(true);
          setUser(response.data.user);
          setError(null);
          return response.data;
        }
      } catch (error) {
        lastError = error;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
    setError(lastError.response?.data?.details || lastError.message);
    throw lastError;
  };

  const googleLogin = async (token) => {
    if (!token) throw new Error('No token provided');
    try {
      const response = await axios.post(`${baseApiUrl}/validate`, { token }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const payload = parseJwt(token);
      if (!payload) throw new Error('Invalid token format');
      const userFromToken = {
        google_id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userFromToken));
      setUser(userFromToken);
      setIsAuthenticated(true);
      setError(null);
      return { token, user: userFromToken, ...response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid token format');
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