import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../src/context/AuthContext';
import api from '../src/api/api';
import { router } from 'expo-router';

type Severidade =
  | 'NON_DESTRUCTIVE'
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'CATASTROPHIC';

// Tipagem explícita para o array severidades
const severidades: { label: string; value: Severidade }[] = [
  { label: 'Não destrutivo', value: 'NON_DESTRUCTIVE' },
  { label: 'Baixa', value: 'LOW' },
  { label: 'Moderada', value: 'MODERATE' },
  { label: 'Alta', value: 'HIGH' },
  { label: 'Crítica', value: 'CRITICAL' },
  { label: 'Catastrófica', value: 'CATASTROPHIC' },
];

export default function CriarDesastre() {
  const { user, token } = useContext(AuthContext);
  const [uf, setUf] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [severidade, setSeveridade] = useState<Severidade>('LOW');
  const [modalVisible, setModalVisible] = useState(false);

  const handleCadastrar = async () => {
    if (!uf || !titulo || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!user || !token) {
      Alert.alert('Erro', 'Usuário ou token não encontrados');
      return;
    }

    try {
      await api.post(
        '/desastres',
        {
          uf,
          titulo,
          descricao,
          severidade,
          usuarioId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Sucesso', 'Desastre cadastrado com sucesso!');
      router.push(`/${user.id}/alerta`);
    } catch (error: any) {
      if (error.response) {
        console.error('Erro no servidor:', error.response.data);
        Alert.alert('Erro', JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error('Nenhuma resposta recebida:', error.request);
        Alert.alert('Erro', 'Nenhuma resposta do servidor');
      } else {
        console.error('Erro', error.message);
        Alert.alert('Erro', error.message);
      }
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const selectSeveridade = (value: Severidade) => {
    setSeveridade(value);
    closeModal();
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push(`/${user?.id}/alerta`)}
      >
        <Ionicons name="chevron-back-outline" size={32} color="#EA003D" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cadastrar Desastre</Text>

      <Text style={styles.label}>UF</Text>
      <TextInput
        placeholder="Ex: SP"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        value={uf}
        onChangeText={setUf}
        autoCapitalize="characters"
        maxLength={2}
      />

      <Text style={styles.label}>Título</Text>
      <TextInput
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        multiline
        placeholderTextColor="#7a7a7a"
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Severidade</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={openModal}>
        <Text style={styles.pickerButtonText}>
          {severidades.find((s) => s.value === severidade)?.label || 'Selecione'}
        </Text>
        <Ionicons name="chevron-down-outline" size={20} color="#EA003D" />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button color="#EA003D" title="Cadastrar" onPress={handleCadastrar} />
      </View>

      {/* Modal para selecionar severidade */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Severidade</Text>
            <FlatList
              data={severidades}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === severidade && styles.optionSelected,
                  ]}
                  onPress={() => selectSeveridade(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === severidade && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#EA003D',
    fontSize: 18,
    marginLeft: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#EA003D',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#3a3a3a',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 16,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 24,
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '50%',
  },
  modalTitle: {
    color: '#EA003D',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionSelected: {
    backgroundColor: '#EA003D',
    borderRadius: 6,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#555',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#EA003D',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
