// src/context/authContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { login as apiLogin, logoutServer, getStoredAuth, validateToken } from '../api/auth';
import { useNavigate } from "react-router";

const AuthContext = createContext();

const POLL_MS = 4 * 60 * 1000; // validate every 4 minutes

export const AuthProvider = ({ children }) => {
  const [{ user, token }, setAuth] = useState(() => getStoredAuth());

  const isAuthenticated = !!token;

  const setAuthSafe = useCallback((next) => {
    setAuth((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      // Keep localStorage in sync
      if (!value?.token) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } else {
        localStorage.setItem('authToken', value.token);
        localStorage.setItem('authUser', JSON.stringify(value.user || null));
      }
      return value;
    });
  }, []);

  const login = useCallback(async (username, password) => {
    const resUser = await apiLogin(username, password); // writes storage on success
    const authToken = localStorage.getItem('authToken');
    setAuthSafe({ token: authToken, user: resUser });
    return resUser;
  }, [setAuthSafe]);

  const logout = useCallback(async () => {
    try {
      await logoutServer(); // server-side cleanup
    } catch (e) {
      // ignore errors if server is unreachable
    }
    setAuthSafe({ token: null, user: null });

    // 🔹 Force full page reload to login
    window.location.href = "/login";
  }, [setAuthSafe]);

  // Initial sync in case other tabs changed storage before mount
  useEffect(() => {
    const { token: t, user: u } = getStoredAuth();
    if (t) {
      setAuthSafe({ token: t, user: u });
      doValidate(); // run right away
    }
  }, []);

  // Regular token validation
  let lastValidation = 0;
  const doValidate = useCallback(async () => {
    if (!isAuthenticated) return;

    const now = Date.now();
    if (now - lastValidation < 2000) return; // skip if last call < 2s ago
    lastValidation = now;

    try {
      const ok = await validateToken();
      if (!ok) await logout();
    } catch {
      await logout();
    }
  }, [isAuthenticated, logout]);


  useEffect(() => {
  const onStorage = (e) => {
    if (e.key === 'auth-event') {
      try {
        const evt = JSON.parse(e.newValue || '{}');
        if (evt?.type === 'logout') logout();
      } catch {}
    }
    if (e.key === 'authToken' || e.key === 'authUser') {
      const { token: t, user: u } = getStoredAuth();
      setAuthSafe({ token: t, user: u });
    }
  };

  const id = setTimeout(() => {
    window.addEventListener("focus", doValidate);
    window.addEventListener("visibilitychange", doValidate);
    window.addEventListener("storage", onStorage);
  }, 100);

  return () => {
    clearTimeout(id);
    window.removeEventListener("focus", doValidate);
    window.removeEventListener("visibilitychange", doValidate);
    window.removeEventListener("storage", onStorage);
  };
}, [doValidate, logout, setAuthSafe]);


  // Cross-tab sync & interceptors’ 401 broadcast
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'auth-event') {
        try {
          const evt = JSON.parse(e.newValue || '{}');
          if (evt?.type === 'logout') logout();
        } catch { }
      }
      if (e.key === 'authToken' || e.key === 'authUser') {
        const { token: t, user: u } = getStoredAuth();
        setAuthSafe({ token: t, user: u });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [logout, setAuthSafe]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    login,
    logout,
    setAuth: setAuthSafe,
  }), [user, token, isAuthenticated, login, logout, setAuthSafe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
