import axios from 'axios';
import { FIREBASE_CONFIG } from '../../services/config';
import { getAuthToken, clearStorage } from '../../utils/storage';
import { store } from '../../store';

const handleUnauthorized = async () => {
  // Clear user session and redirect to login
  await clearStorage();
  // You can dispatch a logout action here
  store.dispatch({ type: 'user/clearUser' });
};

const api = axios.create({
  baseURL: FIREBASE_CONFIG.databaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;