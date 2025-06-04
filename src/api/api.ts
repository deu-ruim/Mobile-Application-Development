import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.10.158:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      await AsyncStorage.removeItem('@token');

      Alert.alert('Sessão expirada', 'Sua sessão expirou. Faça login novamente.');
      router.replace('/login'); 

      return Promise.reject(new Error('Sessão expirada'));
    }

    return Promise.reject(error);
  }
);

export default api;
