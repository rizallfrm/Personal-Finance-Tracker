import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  // Token akan ditambahkan via interceptor atau header manual
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expired
    }
    return Promise.reject(error);
  }
);

export default instance;