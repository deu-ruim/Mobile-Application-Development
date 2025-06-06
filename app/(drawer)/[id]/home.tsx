import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/api/api';
import { Usuario } from '../../../src/types/usuario'; 
import { GlobalStyles } from '../../../src/styles/global';
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
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="red" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <ScrollView style={GlobalStyles.somos}>
      <View>
        <Text style={[GlobalStyles.textSomos, { color: 'white' }]}> Seja Bem-vindo, {usuario.username}!</Text>
      </View>

      <View>
        {errorLocation && <Text style={{ color: 'yellow' }}>Erro na localização: {errorLocation}</Text>}
        {errorWeather && <Text style={{ color: 'yellow' }}>Erro no clima: {errorWeather}</Text>}

        {loadingWeather ? (
          <ActivityIndicator size="small" color="white" />
        ) : temp !== null ? (
          <View>
            <View>
              <Text>Temperatura atual na sua localização:</Text>
              {iconUrl && (
                <Image
                source={{ uri: iconUrl }}
                style={{ width: 50, height: 50}}
                />
              )}
              <Text>{temp.toFixed(1)} °C </Text>
            </View>
          </View>
        ) : (
          <Text style={[GlobalStyles.textinho, { color: 'white' }]}>Não foi possível obter a temperatura.</Text>
        )}
      </View>

      <View>
        <Text style={[GlobalStyles.textinho, { color: 'white', paddingVertical: 20 }]}>
          “Deu Ruim” é um aplicativo desenvolvido como parte da atividade acadêmica Global Solution, proposta pela FIAP (Faculdade de Informática e Administração Paulista).{'\n'}O projeto tem como objetivo facilitar a comunicação de alertas regionais em situações de risco, como desastres naturais ou emergências públicas. No aplicativo, administradores podem cadastrar alertas vinculados a uma determinada região. Usuários que estiverem naquela localidade são notificados automaticamente, promovendo uma resposta mais rápida e eficiente.
        </Text>
      </View>

      <View style={GlobalStyles.git}>
        <Text style={[GlobalStyles.textinho, { color: 'white', fontSize: 20 }]}>Conheça nosso Github</Text>
        <Text style={[GlobalStyles.textinho, { color: '#494949', fontSize: 15, width: 200, textAlign: 'center' }]}>Projeto realizado para a Global solution da Fiap</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/deu-ruim')}>
          <Text style={[GlobalStyles.textinho, { color: '#EA003D', fontSize: 15, textAlign: 'center' }]}>Deu Ruim!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
