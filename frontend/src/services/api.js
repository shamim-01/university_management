import axios from 'axios';

// ✅ Dynamic API URL - Environment based
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    console.log('📤 Token exists?', token ? 'Yes' : 'No');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  response => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    // Network Error handling
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error: Cannot connect to server');
      console.error('❌ Please make sure backend is running at:', API_URL);
    }

    console.error(
      '❌ API Error:',
      error.response?.status,
      error.response?.data?.message || error.message,
    );

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
