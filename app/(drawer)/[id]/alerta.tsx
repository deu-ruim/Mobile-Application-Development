import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, LayoutAnimation} from 'react-native';
import api from '../../../src/api/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Desastre } from '../../../src/types/desastre';
import { Ionicons } from '@expo/vector-icons';


interface Usuario {
  id: number;
  username: string;
  email: string;
  uf: string;
  ativo: boolean;
  role?: string;
}

const SEVERIDADES = [
  'NON_DESTRUCTIVE',
  'LOW',
  'MODERATE',
  'HIGH',
  'CRITICAL',
  'CATASTROPHIC',
] as const;

export default function Alerta() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);
  const [desastres, setDesastres] = useState<Desastre[]>([]);
  const [carregandoDesastres, setCarregandoDesastres] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [filtroSeveridade, setFiltroSeveridade] = useState<string | null>(null);

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
    async function carregarDesastres() {
      if (!usuario) return;

      setCarregandoDesastres(true);

      try {
        const token = await AsyncStorage.getItem('@token');

        // Monta a query string com uf e severidade se tiver filtro
        let url = `/desastres?uf=${usuario.uf}`;
        if (filtroSeveridade) {
          url += `&severidade=${filtroSeveridade}`;
        }

        const resposta = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

    carregarDesastres();
  }, [usuario, filtroSeveridade]);

  function toggleExpandir(id: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(expandido === id ? null : id);
  }

  async function handleExcluirDesastre(id: number) {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este desastre?',
      [
        { text: 'Cancelar'},
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('@token');
              await api.delete(`/desastres/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setDesastres((prev) => prev.filter((d) => d.id !== id));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o desastre.');
              console.error(error);
            }
          },
        },
      ]
    );
  }

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
        {usuario?.role === 'ADMIN' && (
          <TouchableOpacity onPress={() => router.push('../../criarDesastre')}>
            <Text>Criar um desastre</Text>
          </TouchableOpacity>
        )}
        <Text>Nenhum desastre encontrado na região de {usuario?.uf}.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Alerta!!!</Text>
      <Text>Desastres da região {usuario?.uf}</Text>

      {usuario?.role === 'ADMIN' && (
        <TouchableOpacity onPress={() => router.push('../../criarDesastre')}>
          <Text>Criar Desastre</Text>
        </TouchableOpacity>
      )}

      <View>
        <TouchableOpacity onPress={() => setFiltroSeveridade(null)}>
          <Text>Todos</Text>
        </TouchableOpacity>

        {SEVERIDADES.map((sev) => (
          <TouchableOpacity
            key={sev}
            onPress={() => setFiltroSeveridade(sev)}>
            <Text>{sev}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={desastres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const aberto = expandido === item.id;

          return (
            <TouchableOpacity onPress={() => toggleExpandir(item.id)}>
              <View>
                <Ionicons name="earth-outline" size={40} color="red" />
                <Text>{item.titulo}</Text>
                <Ionicons name="warning-outline" size={40} color="red" />
                <Text>{item.severidade}</Text>
              </View>

              {aberto && (
                <View>
                  <Ionicons name="chatbubble-ellipses-outline" size={40} color="red" />
                  <Text>Descrição: {item.descricao}</Text>
                  <Ionicons name="calendar-outline" size={40} color="red" />
                  <Text>Criado em: {new Date(item.createdAt).toLocaleString()}</Text>
                  <Ionicons name="person-circle-outline" size={40} color="red" />
                  <Text>Feito por: {item.usuario.username}</Text>

                  {usuario?.role === 'ADMIN' && (
                    <TouchableOpacity onPress={() => handleExcluirDesastre(item.id)}>
                      <Ionicons name="trash-outline" size={30} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}