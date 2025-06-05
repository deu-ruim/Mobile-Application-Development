import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import api from '../src/api/api'; 

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
    <ScrollView>
      <View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="chevron-back-outline" size={40} color="red" />
        </TouchableOpacity>
      </View>

      <View>
        <Text>Olá, Seja bem-vindo(a)</Text>
        <Text>Cadastro</Text>
      </View>

      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
        />

        <TouchableOpacity
          onPress={handleCadastrar}>
          <Text>Cadastrar</Text>
        </TouchableOpacity>

        <View>
          <Text>Você já tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text> Logar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
