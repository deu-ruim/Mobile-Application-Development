import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
        <Ionicons name="chevron-back-outline" size={40} color="#EA003D" />
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Olá, seja bem-vindo(a) de volta!</Text>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#4D4D4D"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          style={styles.passwordInput}
          placeholderTextColor="#4D4D4D"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Logar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerRedirect}>
        <Text style={styles.textLight}>Você não tem conta?</Text>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.linkText}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 80,
  },
  backButton: {
    marginBottom: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#424242',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 20,
    color: 'white',
  },
  eyeButton: {
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#EA003D',
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  registerRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingLeft: 8,
  },
  textLight: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  linkText: {
    color: '#EA003D',
    fontSize: 16,
    fontWeight: '600',
  },
});
