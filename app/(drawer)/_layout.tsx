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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EA003D" />
      </View>
    );
  }

  if (!isAuthenticated || !id) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1C1C1C', // Fundo escuro do header
        },
        headerTintColor: 'white', // Texto branco no header
        drawerStyle: styles.drawer,
        drawerLabelStyle: styles.label,
        drawerActiveBackgroundColor: '#333333',
        drawerActiveTintColor: '#EA003D',
        drawerInactiveTintColor: 'white',
      }}
    >
      <Drawer.Screen name='[id]/pag-user' options={{ title: 'Página Usuário' }} />
      <Drawer.Screen name="quem-somos" options={{ title: 'Quem Somos' }} />
      <Drawer.Screen name='[id]/alerta' options={{ title: 'Alerta' }} />
      <Drawer.Screen name='[id]/home' options={{ title: 'Home' }} />
      <Drawer.Screen 
        name="sair" 
        options={{ 
          title: 'Sair',
          drawerLabelStyle: { color: '#EA003D', fontWeight: 'bold' }, // Sair em vermelho
        }} 
      />
      <Drawer.Screen name="[id]/atualizar" options={{ title: 'Atualizar', drawerItemStyle: { display: 'none' }}} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#1C1C1C', // Fundo do drawer escuro
  },
  label: {
    color: 'white',
    fontSize: 18,
  },
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
