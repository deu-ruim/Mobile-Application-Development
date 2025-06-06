import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../src/context/AuthContext';
import api from '../src/api/api';
import { router } from 'expo-router';
import { GlobalStyles } from '../src/styles/global';

type Severidade = 'NON_DESTRUCTIVE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';

export default function CriarDesastre() {
  const { user, token } = useContext(AuthContext);
  const [uf, setUf] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [severidade, setSeveridade] = useState<Severidade>('LOW');

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

  return (
    <ScrollView style={GlobalStyles.formulario}>
      <Text style={GlobalStyles.textForms}>Cadastrar Desastre</Text>

      <Text>UF</Text>
      <TextInput
        placeholder="Ex: SP"
        style={GlobalStyles.caixa}
        placeholderTextColor="#4D4D4D"
        value={uf}
        onChangeText={setUf}
        autoCapitalize="characters"
        maxLength={2}
      />

      <Text>Título</Text>
      <TextInput value={titulo} onChangeText={setTitulo} style={GlobalStyles.caixa} placeholderTextColor="#4D4D4D"/>

      <Text>Descrição</Text>
      <TextInput
        multiline
        placeholderTextColor="#4D4D4D"
        style={GlobalStyles.caixa}
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text>Severidade</Text>
      <Picker
        style={GlobalStyles.caixa}
        selectedValue={severidade}
        onValueChange={(itemValue: Severidade) => setSeveridade(itemValue)}
      >
        <Picker.Item label="Não destrutivo" value="NON_DESTRUCTIVE" />
        <Picker.Item label="Baixa" value="LOW" />
        <Picker.Item label="Moderada" value="MODERATE" />
        <Picker.Item label="Alta" value="HIGH" />
        <Picker.Item label="Crítica" value="CRITICAL" />
        <Picker.Item label="Catastrófica" value="CATASTROPHIC" />
      </Picker>

      <View>
        <Button title="Cadastrar" color="red" onPress={handleCadastrar} />
      </View>
    </ScrollView>
  );
}
