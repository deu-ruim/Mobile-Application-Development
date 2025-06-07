import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import api from '../src/api/api';

const UFS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uf, setUf] = useState('');
  const [ativo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [ufDropdownOpen, setUfDropdownOpen] = useState(false);

  function toggleDropdown() {
    setUfDropdownOpen(!ufDropdownOpen);
  }

  function selecionarUf(sigla: string) {
    setUf(sigla);
    setUfDropdownOpen(false);
  }

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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="chevron-back-outline" size={40} color="#EA003D" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Olá, Seja bem-vindo(a)</Text>
        <Text style={styles.title}>Cadastro</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          placeholderTextColor="#AAAAAA"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#AAAAAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
          <Text style={[styles.dropdownText, { color: uf ? 'white' : '#999' }]}>
            {uf ? UFS.find((item) => item.sigla === uf)?.nome : 'Selecione o estado'}
          </Text>
          <Ionicons
            name={ufDropdownOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="white"
          />
        </TouchableOpacity>

        {ufDropdownOpen && (
          <ScrollView
            style={styles.dropdownList}
            nestedScrollEnabled={true}
          >
            {UFS.map((item) => (
              <TouchableOpacity
                key={item.sigla}
                onPress={() => selecionarUf(item.sigla)}
                style={[
                  styles.dropdownItem,
                  uf === item.sigla && styles.dropdownItemSelected,
                ]}
              >
                <Text style={styles.dropdownItemText}>{item.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCadastrar}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.loginRedirect}>
          <Text style={styles.text}>Você já tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.link}> Logar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#424242',
    color: 'white',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 18,
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
    fontSize: 18,
    color: 'white',
  },
  eyeButton: {
    paddingLeft: 10,
  },
  dropdown: {
    backgroundColor: '#424242',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 18,
  },
  dropdownList: {
    maxHeight: 180,
    backgroundColor: '#2F2F2F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4D4D4D',
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dropdownItemSelected: {
    backgroundColor: '#3D3D3D',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#EA003D',
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  text: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  link: {
    color: '#EA003D',
    fontSize: 16,
    fontWeight: '600',
  },
});
