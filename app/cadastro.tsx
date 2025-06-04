import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import api from '../src/api/api'; // ajuste o caminho se necessário

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uf, setUf] = useState('');
  const [ativo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  async function handleCadastrar() {
    if (!username || !email || !password || !uf) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const dadosUsuario = {
      email,
      username,
      password,
      uf,
      ativo,
    };

    try {
      const response = await api.post('/usuarios/register', dadosUsuario);
      const usuarioCriado = response.data;

      Alert.alert('Sucesso', `Cadastro de ${usuarioCriado.username} realizado com sucesso!`);
      router.push('/');
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Erro ao cadastrar. Tente novamente.';
        Alert.alert('Erro', msg);
      } else {
        Alert.alert('Erro', 'Erro desconhecido.');
      }
      console.error(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="chevron-back-outline" size={40} color="red" />
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 20 }}>
        <Text>Olá, Seja bem-vindo(a)</Text>
        <Text>Cadastro</Text>
      </View>

      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, marginBottom: 10 }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{ flex: 1, padding: 8 }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: 10 }}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="UF"
          value={uf}
          onChangeText={setUf}
          autoCapitalize="characters"
          maxLength={2}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />

        <TouchableOpacity
          onPress={handleCadastrar}
          style={{ backgroundColor: 'red', padding: 12, alignItems: 'center', borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <Text>Você já tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ color: 'red' }}> Logar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
