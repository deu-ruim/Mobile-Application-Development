import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EA003D" />
        <Text style={styles.loadingText}>Carregando usuário...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {usuario.username}!</Text>
        <Image source={require('../../../assets/pag-user/usuario.png')} style={styles.userImage} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>UserName</Text>
        <Text style={styles.value}>{usuario.username}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{usuario.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>UF</Text>
        <Text style={styles.value}>{usuario.uf}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{usuario.role}</Text>
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => router.push('./atualizar')}
      >
        <Text style={styles.updateButtonText}>Atualizar Dados</Text>
      </TouchableOpacity>

      {usuario.role !== 'ADMIN' && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.adminButtonText}>Alterar role para ADMIN</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push('../sair')}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmação de administrador</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Email do admin"
              placeholderTextColor="#666"
              autoCapitalize="none"
              keyboardType="email-address"
              value={adminEmail}
              onChangeText={setAdminEmail}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Senha do admin"
              placeholderTextColor="#666"
              secureTextEntry
              value={adminSenha}
              onChangeText={setAdminSenha}
            />

            <View style={styles.modalButtons}>
              <View style={styles.modalButtonWrapper}>
                <Button
                  title="Cancelar"
                  color="#888"
                  onPress={() => {
                    setModalVisible(false);
                    setAdminEmail('');
                    setAdminSenha('');
                  }}
                />
              </View>
              <View style={styles.modalButtonWrapper}>
                <Button
                  title="Confirmar"
                  color="#EA003D"
                  onPress={handleConfirmarRole}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  loadingText: {
    color: '#EA003D',
    marginTop: 10,
    fontSize: 18,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  errorText: {
    color: '#EA003D',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 26,
    color: 'white',
    marginBottom: 12,
  },
  userImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  infoBox: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    color: '#AAAAAA',
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#EA003D',
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 10,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  adminButton: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 10,
  },
  adminButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#424242',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
