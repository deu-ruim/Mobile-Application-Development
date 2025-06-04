import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/api/api';
import { Usuario } from '../../../src/types/usuario'; // caminho para o tipo

export default function PagUser() {
  const { id } = useLocalSearchParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null); // <<< aqui resolve
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
        <Text>{usuario.username}!</Text>
        <Image source={require('../../../assets/pag-user/usuario.png')}/>
      </View>
      <View>
        <View>
          <Text>UserName</Text>
          <Text>{usuario.username}</Text>
        </View>
        <View>
          <Text>Email</Text>
          <Text>{usuario.email}</Text>
        </View>
        <View>
          <Text>UF</Text>
          <Text>{usuario.uf}</Text>
        </View>
        {/* Aqui ainda não tem pq preciso q java atualize */}
        
      </View>
    </ScrollView>
  );
}
