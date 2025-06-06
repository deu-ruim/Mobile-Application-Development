import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
  const [showPasswords, setShowPasswords] = useState(false);

  const handleAtualizar = async () => {
    if (!username || !email || !uf || !senhaAtual) {
      Alert.alert('Erro', 'Todos os campos obrigatórios devem ser preenchidos, incluindo a senha atual.');
      return;
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    try {
      const dadosAtualizados: any = {
        username,
        email,
        uf,
        ativo: true,
      };

      if (novaSenha) {
        dadosAtualizados.password = novaSenha;
      }

      await api.put(`/usuarios/${user?.id}`, dadosAtualizados);

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!\nÉ preciso logar novamente');
      updateUser({ username, email, uf });
      logout(); 

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Erro ao atualizar os dados.';
      Alert.alert('Erro', msg);
    }
  };

  return (
    <ScrollView>

        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-outline" size={40} color="red" />
        </TouchableOpacity>

        <Text>Editar Perfil</Text>

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

            <TextInput
                placeholder="UF"
                value={uf}
                onChangeText={setUf}
                autoCapitalize="characters"
                maxLength={2}
                />

            <TextInput
                placeholder="Digite sua senha atual"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                secureTextEntry={!showPasswords}
                />
        </View>
        <View>
            <Text>Nova senha (opcional)</Text>

            <TextInput
              placeholder="Nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!showPasswords}
              />

            <TextInput
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!showPasswords}
              />

            <TouchableOpacity>
              <Text>
                {showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAtualizar}>
              <Text>Salvar Alterações</Text>
            </TouchableOpacity>
        </View>  
    </ScrollView>
  );
}
