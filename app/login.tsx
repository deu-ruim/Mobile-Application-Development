import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { AuthContext } from '../src/context/AuthContext';
import { GlobalStyles } from '../src/styles/global';

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
    <ScrollView style={GlobalStyles.formulario}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="chevron-back-outline" size={40} color="#EA003D" />
      </TouchableOpacity>

      <Text style={GlobalStyles.textForms}>Olá, seja bem-vindo(a) de volta!</Text>
      <Text style={GlobalStyles.textForms}>Login</Text>

      <TextInput
        placeholder="Email"
        style={GlobalStyles.caixa}
        placeholderTextColor="#4D4D4D"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={[GlobalStyles.caixa, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <TextInput
          placeholder="Senha"
          style={[{ fontSize: 20, }]}
          value={senha}
          placeholderTextColor="#4D4D4D"
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
          <Ionicons style={[{ justifyContent:'center', padding:10 }]} name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={GlobalStyles.botao} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[GlobalStyles.text, { color: 'white' }]}>Logar</Text>
        )}
      </TouchableOpacity>

      <View style={[{ flexDirection: 'row', paddingLeft: 40, paddingTop: 20 }]}>
        <Text style={[GlobalStyles.textinho, { color: 'white' }]}>Você não tem conta?</Text>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={[GlobalStyles.textinho, { color: '#EA003D' }]}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}