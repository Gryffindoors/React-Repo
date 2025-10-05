// src/context/authContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { login as apiLogin, logoutServer, getStoredAuth, validateToken } from '../api/auth';

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
    await logoutServer(); // also clears local
    setAuthSafe({ token: null, user: null });
  }, [setAuthSafe]);

  // Initial sync in case other tabs changed storage before mount
  useEffect(() => {
    const { token: t, user: u } = getStoredAuth();
    setAuthSafe({ token: t, user: u });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regular token validation
  const doValidate = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const ok = await validateToken();
      if (!ok) await logout();
    } catch {
      await logout();
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    // on mount
    doValidate();

    // on focus / visibility
    const onFocus = () => doValidate();
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);

    // periodic
    const id = setInterval(doValidate, POLL_MS);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
      clearInterval(id);
    };
  }, [doValidate]);

  // Cross-tab sync & interceptors’ 401 broadcast
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
