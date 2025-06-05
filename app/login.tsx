import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { AuthContext } from '../src/context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha o email e a senha');
      return;
    }

    try {
      
      setLoading(true);
      const user = await login(email, senha); 
      Alert.alert('Sucesso', 'Login realizado!');
      router.replace(`/${user.id}/home`);
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Email ou senha incorretos.';
        Alert.alert('Erro', msg);
      } else {
        Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="chevron-back-outline" size={40} color="red" />
      </TouchableOpacity>

      <Text>Olá, seja bem-vindo(a) de volta!</Text>
      <Text>Login</Text>

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
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
          <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text>Logar</Text>
        )}
      </TouchableOpacity>

      <View>
        <Text>Você não tem conta?</Text>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}