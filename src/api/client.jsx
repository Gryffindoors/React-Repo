// src/api/client.js
import axios from 'axios';
import config from '../../config';

const isDev = import.meta.env.MODE === 'development';

const client = axios.create({
  baseURL: isDev ? '/api' : '/api/google',
});

function getToken() {
  const t = localStorage.getItem('authToken');
  return t && t !== 'undefined' && t !== 'null' ? t : null;
}

client.interceptors.request.use((cfg) => {
  cfg.params = cfg.params || {};
  const isLogin = cfg?.data?.action === 'login' || cfg?.params?.action === 'login';

  if (isLogin) {
    // Put API key in payload if missing
    if (config.API_KEY && !cfg?.data?.apiKey) {
      cfg.data = { ...(cfg.data || {}), apiKey: config.API_KEY };
    }
    // ALSO put API key in query (covers servers that read from params)
    // if (config.API_KEY && !cfg?.params?.apiKey) {
    //   cfg.params.apiKey = config.API_KEY;
    // }
  } else {
    // Attach token as query param (your current convention)
    const token = getToken();
    if (token) cfg.params.token = token;
  }

  return cfg;
});

// Optional: global 401 broadcast remains fine
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.setItem('auth-event', JSON.stringify({ type: 'logout', ts: Date.now() }));
      } catch {}
    }
    return Promise.reject(err);
  }
);

export default client;
