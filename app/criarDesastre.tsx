import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../src/context/AuthContext';
import api from '../src/api/api';
import { router } from 'expo-router';

export default function CriarDesastre() {
  const { user, token } = useContext(AuthContext);
  const [uf, setUf] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [severidade, setSeveridade] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

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
      console.log('Token:', token);
      console.log({ uf, titulo, descricao, severidade, usuarioId: user.id });

      const response = await api.post(
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
      router.push(`/${user.id}/home`);
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

  return (
    <ScrollView>
      <Text>Cadastrar Desastre</Text>

      <Text>UF</Text>
      <TextInput
        placeholder="Ex: SP"
        value={uf}
        onChangeText={setUf}
        autoCapitalize="characters"
        maxLength={2}
      />

      <Text>Título</Text>
      <TextInput value={titulo} onChangeText={setTitulo} />

      <Text>Descrição</Text>
      <TextInput
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text>Severidade</Text>
      <Picker
        selectedValue={severidade}
        onValueChange={(itemValue: string) =>
          setSeveridade(itemValue as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')
        }
      >
        <Picker.Item label="Baixa" value="LOW" />
        <Picker.Item label="Média" value="MEDIUM" />
        <Picker.Item label="Alta" value="HIGH" />
        <Picker.Item label="Crítica" value="CRITICAL" />
      </Picker>

      <View>
        <Button title="Cadastrar" color="red" onPress={handleCadastrar} />
      </View>
    </ScrollView>
  );
}
