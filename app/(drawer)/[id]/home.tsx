import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/api/api';
import { Usuario } from '../../../src/types/usuario'; 

export default function Home() {
  const { id } = useLocalSearchParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const token = await AsyncStorage.getItem('@token');
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
        setLoading(false);
      }
    }

    if (id) fetchUsuario();
  }, [id]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="red" />
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <Text> Seja Bem-vindo, {usuario.username}!</Text>
      </View>
      <View>
        <Text>Dados metereologicos e etc</Text>
      </View>
      <View>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
      </View>
      <View>
        <View>
          <Text>Conheça nosso Github</Text>
          <Text>Projeto realizado para a Global solution da Fiap</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/deu-ruim')}>
            <Text>Deu Ruim!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
