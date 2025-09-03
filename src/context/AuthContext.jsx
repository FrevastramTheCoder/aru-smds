// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    return JSON.parse(atob(base64Payload));
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

  // Logout function
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
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  // Auto refresh token 1 minute before expiry
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
        const res = await fetch(`${baseApiUrl}/refresh`, {
          method: 'POST',
          credentials: 'include',
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

  // Register user
  const register = async (username, email, password, retries = 3) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${baseApiUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthenticated(true);
          setUser(data.user);
          setError(null);
        }
        return data;
      } catch (err) {
        lastError = err;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    setError(lastError.message);
    throw lastError;
  };

  // Login user
  const login = async (formData, retries = 3) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${baseApiUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        setError(null);
        return data;
      } catch (err) {
        lastError = err;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    setError(lastError.message);
    throw lastError;
  };

  // Google login
  const googleLogin = async (token) => {
    if (!token) throw new Error('No token provided');
    try {
      const payload = parseJwt(token);
      if (!payload) throw new Error('Invalid token');

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

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
