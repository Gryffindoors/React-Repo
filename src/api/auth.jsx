// src/api/auth.js
import client from './client';
import config from '../../config';

function safeParse(value, fallback = null) {
  if (value == null) return fallback;
  if (value === 'undefined' || value === 'null') return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

export function getStoredAuth() {
  const token = localStorage.getItem('authToken') || null;
  const user = safeParse(localStorage.getItem('authUser'), null);
  return { token, user };
}

function setAuthToken(token) {
  if (token) localStorage.setItem('authToken', token);
  else localStorage.removeItem('authToken');
}

function setAuthUser(user) {
  if (user && typeof user === 'object') {
    localStorage.setItem('authUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('authUser');
  }
}

export async function login(username, password) {
  // ---- build request ----
  const endpoint = ''; // base route; your proxy maps it to GAS
  const payload = {
    action: 'login',
    username,
    password,
    apiKey: config.API_KEY, // include API key in body
  };
  // const params = {
  //   apiKey: config.API_KEY, // mirror in query (harmless if ignored)
  // };

  // Masked copy for logging
  const masked = {
    ...payload,
    password: password ? '***' + String(password).slice(-2) : null,
  };

  // ---- log request ----
  console.groupCollapsed('🔐 [AUTH] Login → request');
  console.log('baseURL:', client.defaults.baseURL);
  console.log('endpoint:', endpoint || '(root)');
  console.log('method:', 'POST');
  // console.log('params:', params);
  console.log('payload:', masked);
  console.groupEnd();

  // ---- send request ----
const res = await client.post(endpoint, payload, { params: { action: 'login' } });

  // ---- log response (tidy) ----
  console.groupCollapsed('🔐 [AUTH] Login ← response');
  console.log('status:', res?.status);
  console.log('data:', res?.data);
  console.groupEnd();

  // ---- tolerant extraction ----
  const data = res?.data || {};
  const token =
    data.token ?? data.Token ?? data.authToken ?? data.AuthToken ?? null;
  const user =
    data.user ?? data.User ?? (data.username ? { username: data.username } : null);
  const success =
    data.success === true || data.ok === true || data.status === 200 || data.status === 'ok';

  // ---- final check & store ----
  if (!success || !token || !user) {
    console.warn('🔐 [AUTH] Invalid login response:', { success, tokenExists: !!token, userExists: !!user });
    setAuthToken(null);
    setAuthUser(null);
    throw new Error('Invalid login response');
  }

  setAuthToken(token);
  setAuthUser(user);
  console.info('🔐 [AUTH] Login: success for', user?.username ?? '(unknown)');
  return user;
}

// Optional; keep if you use them elsewhere
export async function logoutServer() {
  console.log('🔐 [AUTH REQUEST] Logout attempt');
  
  // Log request details for logout
  if (client.defaults.headers) {
    console.log('🔐 [AUTH REQUEST] Logout headers:', client.defaults.headers);
  }
  
  try { 
    const response = await client.post('auth/logout');
    console.log('🔐 [AUTH RESPONSE] Logout success:', response);
    console.log('🔐 [AUTH RESPONSE] Logout data:', response?.data);
  } catch (error) {
    console.error('🔐 [AUTH ERROR] Logout failed:', error);
    console.error('🔐 [AUTH ERROR] Logout response:', error?.response);
  } finally {
    setAuthToken(null); 
    setAuthUser(null);
    console.log('🔐 [AUTH] Local storage cleared');
  }
}

export async function validateToken() {
  console.log('🔐 [AUTH REQUEST] Token validation attempt via action=auth/status');

  try {
    const response = await client.get('', {
      params: { action: 'auth/status' },
    });
    console.log('🔐 [AUTH RESPONSE] /auth/status:', response?.data);
    return !!response?.data;
  } catch (error) {
    console.error('🔐 [AUTH ERROR] Token validation failed:', error);
    return false;
  }
}



// Helper to log current auth state
export function logAuthState() {
  const auth = getStoredAuth();
  console.log('🔐 [AUTH STATE] Current auth:', {
    hasToken: !!auth.token,
    tokenPreview: auth.token ? auth.token.substring(0, 10) + '...' : null,
    user: auth.user
  });
}