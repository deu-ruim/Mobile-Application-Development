import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';
import api from '../src/api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha o email e a senha');
      return;
    }

    try {
      const response = await api.post('/usuarios/login', {
      email,
      password: senha,
      });

      const { token} = response.data;
      // const { token, usuario } = response.data;

      await AsyncStorage.setItem('@token', token);
      const idTemporario = 24
      Alert.alert('Sucesso', 'Login realizado!');
      // router.push(`/${usuario.id}/home`);
      router.push(`/${idTemporario}/home`);
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Email ou senha incorretos.';
        Alert.alert('Erro', msg);
      } else {
        Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
        console.error(error);
      }
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
        <Text>Olá, Seja bem vindo(a) de volta!</Text>
        <Text>Login</Text>
      </View>

      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View>
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
        >
          <Text>Logar</Text>
        </TouchableOpacity>

        <View>
          <Text>Você não tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text> Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
