import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
} from 'react-native';
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

const SEVERIDADES_KEYS = [
  'NON_DESTRUCTIVE',
  'LOW',
  'MODERATE',
  'HIGH',
  'CRITICAL',
  'CATASTROPHIC',
] as const;

const SeveridadeMap: Record<string, string> = {
  NON_DESTRUCTIVE: 'NÃO DESTRUTIVO',
  LOW: 'BAIXA',
  MODERATE: 'MODERADA',
  HIGH: 'ALTA',
  CRITICAL: 'CRÍTICA',
  CATASTROPHIC: 'CATASTRÓFICA',
};

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

        let url = '/desastres';
        if (usuario.role !== 'ADMIN') {
          url += `?uf=${usuario.uf}`;
          if (filtroSeveridade) {
            url += `&severidade=${filtroSeveridade}`;
          }
        } else {
          if (filtroSeveridade) {
            url += `?severidade=${filtroSeveridade}`;
          }
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
        { text: 'Cancelar', style: 'cancel' },
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
          style: 'destructive',
        },
      ]
    );
  }

  if (loadingUsuario || carregandoDesastres) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EA003D" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alerta!!!</Text>
      <Text style={styles.subHeader}>
        {usuario?.role === 'ADMIN'
          ? 'Desastres em todas as regiões'
          : `Desastres da região ${usuario?.uf}`}
      </Text>

      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={() => router.push('../../criarDesastre')}
      >
        <Text style={styles.cadastrarButtonText}>Cadastrar Desastre</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtroSeveridade === null && styles.filterButtonSelected,
          ]}
          onPress={() => setFiltroSeveridade(null)}
        >
          <Text
            style={[
              styles.filterButtonText,
              filtroSeveridade === null && styles.filterButtonTextSelected,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {SEVERIDADES_KEYS.map((sev) => (
          <TouchableOpacity
            key={sev}
            style={[
              styles.filterButton,
              filtroSeveridade === sev && styles.filterButtonSelected,
            ]}
            onPress={() => setFiltroSeveridade(sev)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filtroSeveridade === sev && styles.filterButtonTextSelected,
              ]}
            >
              {SeveridadeMap[sev]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {desastres.length === 0 ? (
        <Text style={styles.noDataText}>
          Nenhum desastre encontrado {usuario?.role === 'ADMIN' ? '' : `na região de ${usuario?.uf}`}.
        </Text>
      ) : (
        <FlatList
          data={desastres}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const aberto = expandido === item.id;

            return (
              <TouchableOpacity
                onPress={() => toggleExpandir(item.id)}
                style={styles.desastreCard}
                activeOpacity={0.8}
              >
                <View style={styles.desastreHeader}>
                  <Ionicons name="earth-outline" size={30} color="#EA003D" />
                  <Text style={styles.desastreTitulo}>{item.titulo}</Text>
                  <Ionicons name="warning-outline" size={30} color="#EA003D" />
                  <Text style={styles.desastreSeveridade}>{SeveridadeMap[item.severidade]}</Text>
                </View>

                {aberto && (
                  <View style={styles.desastreDetalhes}>
                    <View style={styles.detalheRow}>
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={20}
                        color="#EA003D"
                      />
                      <Text style={styles.detalheText}>Descrição: {item.descricao}</Text>
                    </View>
                    <View style={styles.detalheRow}>
                      <Ionicons name="calendar-outline" size={20} color="#EA003D" />
                      <Text style={styles.detalheText}>
                        Criado em: {new Date(item.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.detalheRow}>
                      <Ionicons name="person-circle-outline" size={20} color="#EA003D" />
                      <Text style={styles.detalheText}>Feito por: {item.usuario.username}</Text>
                    </View>

                    {usuario?.role === 'ADMIN' && (
                      <TouchableOpacity
                        style={styles.excluirButton}
                        onPress={() => handleExcluirDesastre(item.id)}
                      >
                        <Ionicons name="trash-outline" size={24} color="white" />
                        <Text style={styles.excluirButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626', 
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  loadingText: {
    marginTop: 12,
    color: 'white',
    fontSize: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#EA003D',
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
    textAlign: 'center',
  },
  cadastrarButton: {
    backgroundColor: '#EA003D',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  cadastrarButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  noDataText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#3a3a3a',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#EA003D',
  },
  filterButtonText: {
    color: '#ccc',
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  desastreCard: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  desastreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  desastreTitulo: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    flex: 1,
  },
  desastreSeveridade: {
    color: '#EA003D',
    fontWeight: '700',
    fontSize: 16,
  },
  desastreDetalhes: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#555',
    paddingTop: 10,
  },
  detalheRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  detalheText: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1,
  },
  excluirButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA003D',
    borderRadius: 8,
    paddingVertical: 8,
    gap: 6,
  },
  excluirButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
