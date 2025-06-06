import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import api from '../../../src/api/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Desastre } from '../../../src/types/desastre';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Usuario {
  id: number;
  username: string;
  email: string;
  uf: string;
  ativo: boolean;
  role?: string;
}

export default function Alerta() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);
  const [desastres, setDesastres] = useState<Desastre[]>([]);
  const [carregandoDesastres, setCarregandoDesastres] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null); 

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const token = await AsyncStorage.getItem('@token');
        const userJson = await AsyncStorage.getItem('@user');
        const user = userJson ? JSON.parse(userJson) : null;
        const id = user?.id;

        if (!token || !id) throw new Error('Token ou ID não encontrado');

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
        setLoadingUsuario(false);
      }
    }

    fetchUsuario();
  }, []);

  useEffect(() => {
    async function carregarTodosDesastres() {
      if (!usuario) return;

      setCarregandoDesastres(true);
      try {
        const resposta = await api.get(`/desastres?uf=${usuario.uf}`);
        const dados = resposta.data;
        const lista = Array.isArray(dados.content) ? dados.content : dados;
        setDesastres(lista);
      } catch (error) {
        console.error('Erro ao buscar Desastres:', error);
        Alert.alert('Erro', 'Não foi possível carregar os desastres');
      } finally {
        setCarregandoDesastres(false);
      }
    }

    carregarTodosDesastres();
  }, [usuario]);

  if (loadingUsuario || carregandoDesastres) {
    return (
      <View>
        <ActivityIndicator size="large" color="red" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  if (desastres.length === 0) {
    return (
      <View>
        <Text>Nenhum desastre encontrado.</Text>
      </View>
    );
  }

  function toggleExpandir(id: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(expandido === id ? null : id);
  }

  return (
    <View >
      <Text>Alerta!!!</Text>
      <FlatList
        data={desastres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const aberto = expandido === item.id;
          return (
            <TouchableOpacity
              onPress={() => toggleExpandir(item.id)}>
              <Ionicons name="earth-outline" size={40} color="red" />
              <Text>{item.titulo}</Text>
              <Ionicons name="warning-outline" size={40} color="red" />
              <Text>Severidade: {item.severidade}</Text>
              <Ionicons name="location-outline" size={40} color="red" />
              <Text>UF: {item.uf}</Text>

              {aberto && (
                <View>
                  <Ionicons name="chatbubble-ellipses-outline" size={40} color="red" />
                  <Text>Descrição: {item.descricao}</Text>
                  <Ionicons name="calendar-outline" size={40} color="red" />
                  <Text>Criado em: {new Date(item.createdAt).toLocaleString()}</Text>
                  <Ionicons name="person-circle-outline" size={40} color="red" />
                  <Text>Feito por: {item.usuario.username}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
