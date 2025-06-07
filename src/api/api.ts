import axios from 'axios';

const api = axios.create({
  baseURL: 'http://74.163.240.166:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let token: string | null = null;

export const setToken = (newToken: string | null) => {
  token = newToken;
};

api.interceptors.request.use((config) => {
  const isPublicEndpoint =
    config.url?.includes('/usuarios/register') || config.url?.includes('/auth/login');

  if (!isPublicEndpoint && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
