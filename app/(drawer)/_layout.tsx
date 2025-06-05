import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../src/context/AuthContext'; 
import { useRouter } from 'expo-router';

export default function DrawerLayout() {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const [id, setId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userJson = await AsyncStorage.getItem('@user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setId(String(user.id));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do AsyncStorage:', error);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loadingUser]);

  if (loadingUser) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isAuthenticated || !id) {
    return (
      <View>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen name='[id]/pag-user' options={{ title: 'Página Usuário' }} />
      <Drawer.Screen name="quem-somos" options={{ title: 'Quem Somos' }} />
      <Drawer.Screen name='[id]/alerta' options={{ title: 'Alerta' }} />
      <Drawer.Screen name='[id]/home' options={{ title: 'Home' }} />
      <Drawer.Screen name="sair" options={{ title: 'Sair' }} />
    </Drawer>
  );
}
