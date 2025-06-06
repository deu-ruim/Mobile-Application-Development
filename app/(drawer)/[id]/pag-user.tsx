import React, { useEffect, useState, useContext } from 'react';
import {View,Text,ActivityIndicator,Alert,ScrollView,Image,TouchableOpacity,Modal,TextInput,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import api from '../../../src/api/api';
import { Usuario } from '../../../src/types/usuario';
import { AuthContext } from '../../../src/context/AuthContext';

export default function PagUser() {
  const { user, token } = useContext(AuthContext);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminSenha, setAdminSenha] = useState('');

  useEffect(() => {
    async function fetchUsuario() {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/usuarios/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuario();
  }, [user, token]);

  const handleConfirmarRole = async () => {
    if (!adminEmail || !adminSenha) {
      Alert.alert('Erro', 'Informe email e senha do administrador.');
      return;
    }

    try {
      const loginResponse = await api.post('/usuarios/login', {
        email: adminEmail,
        password: adminSenha,
      });

      const { token: adminToken } = loginResponse.data;

      const decodedAdmin = await api.get('/usuarios/me', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (decodedAdmin.data.role !== 'ADMIN') {
        Alert.alert('Erro', 'A conta usada não possui permissão de administrador.');
        return;
      }

      await api.put(
        `/usuarios/${user?.id}`,
        { role: 'ADMIN' },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      setUsuario(prev => (prev ? { ...prev, role: 'ADMIN' } : prev));
      Alert.alert('Sucesso', 'Sua role foi alterada para ADMIN!');
      setModalVisible(false);
      setAdminEmail('');
      setAdminSenha('');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível alterar a role. Verifique os dados.');
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="red" />
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <Text>Olá, {usuario.username}!</Text>
        <Image source={require('../../../assets/pag-user/usuario.png')}/>
      </View>

      <View>
        <Text>UserName</Text>
        <Text>{usuario.username}</Text>
      </View>

      <View>
        <Text>Email</Text>
        <Text>{usuario.email}</Text>
      </View>

      <View>
        <Text>UF</Text>
        <Text>{usuario.uf}</Text>
      </View>

      <View>
        <Text>Role</Text>
        <Text>{usuario.role}</Text>
      </View>

      <TouchableOpacity onPress={() => router.push('./atualizar')}>
        <Text>Atualizar Dados</Text>
      </TouchableOpacity>

      {usuario.role !== 'ADMIN' && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>Alterar role para ADMIN</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push('../sair')}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text>Sair</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View>
          <View >
            <Text>Confirmação de administrador</Text>
            <TextInput
              placeholder="Email do admin"
              autoCapitalize="none"
              keyboardType="email-address"
              value={adminEmail}
              onChangeText={setAdminEmail}
            />
            <TextInput
              placeholder="Senha do admin"
              secureTextEntry
              value={adminSenha}
              onChangeText={setAdminSenha}
            />
            <view>
              <Button
                title="Cancelar"
                onPress={() => {
                  setModalVisible(false);
                  setAdminEmail('');
                  setAdminSenha('');
                }}
              />
              <Button title="Confirmar" onPress={handleConfirmarRole} />
            </view>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

