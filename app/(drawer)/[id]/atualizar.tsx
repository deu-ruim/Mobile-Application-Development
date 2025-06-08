import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AuthContext } from '../../../src/context/AuthContext';
import api from '../../../src/api/api';

export default function Atualizar() {
  const { user, logout, updateUser } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [uf, setUf] = useState(user?.uf || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAtualizar = async () => {
    console.log('--- Tentando atualizar dados ---');
    console.log('Campos:', { username, email, uf, senhaAtual, novaSenha, confirmarSenha });

    if (!username || !email || !uf || !senhaAtual) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos obrigatórios, incluindo a senha atual.'
      );
      return;
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    try {
      const senhaParaEnviar = novaSenha || senhaAtual;

      const dadosAtualizados = {
        username,
        email,
        uf,
        ativo: true,
        role: user?.role || 'USER',
        password: senhaParaEnviar,
      };

      console.log('Enviando para API:', dadosAtualizados);

      const response = await api.put(`/usuarios/${user?.id}`, dadosAtualizados);

      console.log('Resposta da API:', response.status, response.data);

      Alert.alert(
        'Sucesso',
        'Dados atualizados com sucesso!\nVocê será deslogado para efetuar novo login.'
      );

      await updateUser({ username, email, uf });

      // Delay maior antes de deslogar para o alerta ser visto
      setTimeout(() => {
        console.log('Fazendo logout após atualização');
        logout();
      }, 2000); // 2 segundos
    } catch (error: any) {
      console.error('Erro completo:', error);
      console.error('Erro response data:', error.response?.data);
      const msg =
        error.response?.data?.message || 'Erro ao atualizar os dados.';
      Alert.alert('Erro', msg);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={40} color="#EA003D" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="UF"
          placeholderTextColor="#999"
          value={uf}
          onChangeText={setUf}
          autoCapitalize="characters"
          maxLength={2}
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha atual"
          placeholderTextColor="#999"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          secureTextEntry={!showPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Nova senha (opcional)"
          placeholderTextColor="#999"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry={!showPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          placeholderTextColor="#999"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          style={styles.showPasswordBtn}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleAtualizar}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: '700',
    marginBottom: 30,
  },
  form: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#424242',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  showPasswordBtn: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  showPasswordText: {
    color: '#EA003D',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#EA003D',
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});
