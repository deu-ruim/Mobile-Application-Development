import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import api from '../src/api/api'; 
import { GlobalStyles } from '../src/styles/global';

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
    <ScrollView style={GlobalStyles.formulario}>
      <View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="chevron-back-outline" size={40} color="red" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={GlobalStyles.textForms}>Olá, Seja bem-vindo(a)</Text>
        <Text style={GlobalStyles.textForms}>Cadastro</Text>
      </View>

      <View>
        <TextInput
          placeholder="Username"
          style={GlobalStyles.caixa}
          placeholderTextColor="#4D4D4D"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
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
            placeholder="Password"
            style={[{ fontSize: 20, }]}
            placeholderTextColor="#4D4D4D"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              style={[{ justifyContent:'center', padding:10 }]}
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="UF"
          style={GlobalStyles.caixa}
          placeholderTextColor="#4D4D4D"
          value={uf}
          onChangeText={setUf}
          autoCapitalize="characters"
          maxLength={2}
        />

        <TouchableOpacity
          style={[GlobalStyles.botao, { marginTop: 150, }]}
          onPress={handleCadastrar}>
          <Text style={[GlobalStyles.text, { color: 'white' }]}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={[{ flexDirection: 'row', paddingLeft: 70, paddingTop: 20 }]}>
          <Text style={[GlobalStyles.textinho, { color: 'white' }]}>Você já tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[GlobalStyles.textinho, { color: '#EA003D' }]}> Logar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
