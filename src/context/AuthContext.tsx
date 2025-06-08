import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import api, { setToken as applyToken } from '../api/api';
import { Usuario } from '../types/usuario';
import { JwtUser } from '../types/usuario';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => void;
  updateUser: (updatedFields: Partial<Usuario>) => Promise<void>;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = (token: string | null) => {
    setTokenState(token);
    applyToken(token);
  };

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = await AsyncStorage.getItem('@token');
      const storedUser = await AsyncStorage.getItem('@user');

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUser(JSON.parse(storedUser));
        applyToken(storedToken);
      }
    };

    loadStoredData();
  }, []);

  const login = async (email: string, password: string): Promise<Usuario> => {
    const response = await api.post('/usuarios/login', { email, password });
    const { token } = response.data;

    if (!token) throw new Error('Token não retornado.');

    const decoded: JwtUser = jwtDecode(token);
    const userId = decoded.id;

    setToken(token);

    const userResponse = await api.get(`/usuarios/${userId}`);
    const usuarioCompleto: Usuario = userResponse.data;

    await AsyncStorage.setItem('@token', token);
    await AsyncStorage.setItem('@user', JSON.stringify(usuarioCompleto));

    setUser(usuarioCompleto);

    return usuarioCompleto;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['@token', '@user']);
    setToken(null);
    setUser(null);
    Alert.alert('Sessão encerrada', 'Você foi deslogado com sucesso.');
    router.replace('/');
  };

  const updateUser = async (updatedFields: Partial<Usuario>) => {
    if (!user || !token) return;

    try {
      // Mescla dados atuais do usuário com os campos atualizados
      const updatedUserData = {
        ...user,
        ...updatedFields,
      };

      console.log('[updateUser] Dados para enviar:', updatedUserData);

      const response = await api.put(
        `/usuarios/${user.id}`,
        updatedUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser: Usuario = response.data;
      setUser(updatedUser);
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      console.log('[updateUser] Atualização bem-sucedida:', updatedUser);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar dados do usuário.');
      console.error('[updateUser] Erro:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
