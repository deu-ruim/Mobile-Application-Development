import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
  Image,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/api/api';
import { Usuario } from '../../../src/types/usuario';
import { useLocation } from '../../../src/hooks/useLocation';
import { useWeather } from '../../../src/hooks/useWeather';

export default function Home() {
  const { id } = useLocalSearchParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (!token) throw new Error('Token não encontrado');
        const response = await api.get(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    }

    if (id) fetchUsuario();
  }, [id]);

  const { location, loading: loadingLocation, error: errorLocation } = useLocation();
  const { temp, icon, loading: loadingWeather, error: errorWeather } = useWeather(
    location?.latitude || null,
    location?.longitude || null
  );

  if (loadingUser || loadingLocation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Usuário não encontrado.</Text>
      </View>
    );
  }

  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.welcome}>Seja Bem-vindo, {usuario.username}!</Text>

      <View style={styles.weatherBox}>
        {errorLocation && <Text style={styles.warning}>Erro na localização: {errorLocation}</Text>}
        {errorWeather && <Text style={styles.warning}>Erro no clima: {errorWeather}</Text>}

        {loadingWeather ? (
          <ActivityIndicator size="small" color="white" />
        ) : temp !== null ? (
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherText}>Temperatura atual:</Text>
            {iconUrl && <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />}
            <Text style={styles.weatherTemp}>{temp.toFixed(1)} °C</Text>
          </View>
        ) : (
          <Text style={styles.defaultText}>Não foi possível obter a temperatura.</Text>
        )}
      </View>

      <Text style={styles.description}>
        “Deu Ruim” é um aplicativo desenvolvido como parte da atividade acadêmica Global Solution, proposta pela FIAP.
        {'\n\n'}
        O projeto tem como objetivo facilitar a comunicação de alertas regionais em situações de risco, como desastres naturais ou emergências públicas. Usuários são notificados automaticamente ao estarem em regiões com alertas, promovendo resposta rápida e eficiente.
      </Text>

      <View style={styles.githubBox}>
        <Text style={styles.githubTitle}>Conheça nosso Github</Text>
        <Text style={styles.githubSubtitle}>Projeto realizado para a Global Solution da FIAP</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/deu-ruim')}>
          <Text style={styles.githubLink}>Deu Ruim!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  welcome: {
    fontSize: 24,
    fontFamily: 'Lemon-Regular',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  warning: {
    color: '#FFD700',
    marginBottom: 5,
  },
  weatherBox: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  weatherText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  weatherTemp: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  defaultText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  description: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
  },
  githubBox: {
    backgroundColor: '#2F2F2F',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  githubTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Lemon-Regular',
    marginBottom: 5,
  },
  githubSubtitle: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  githubLink: {
    color: '#EA003D',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
