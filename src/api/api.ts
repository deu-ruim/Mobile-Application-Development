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
  console.log('[api.ts] Token atualizado:', token);
};

api.interceptors.request.use((config) => {
  const isPublicEndpoint =
    config.url?.includes('/usuarios/register') || config.url?.includes('/auth/login');

  if (!isPublicEndpoint && token) {
    console.log('[api.ts] Enviando token no header Authorization:', token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('[api.ts] Request:', config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('[api.ts] Resposta recebida:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[api.ts] Erro na resposta:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
