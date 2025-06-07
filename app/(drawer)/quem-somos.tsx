import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Home() {
  useEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        Alert.alert('Acesso negado', 'Você precisa estar logado para acessar essa página.');
        router.replace('/login');
      }
    };

    verificarToken();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quem somos!</Text>
        <Text style={styles.subtitle}>Fiap</Text>
      </View>

      <View style={styles.card}>
        <Image source={require('../../assets/sobre-nos/erick-img.png')} style={styles.imagem} />
        <View style={styles.info}>
          <Text style={styles.nome}>Erick Alves</Text>
          <Text style={styles.textinho}>RM 556862</Text>
          <Text style={styles.textinho}>2TDSPM</Text>
          <View style={styles.links}>
            <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL('https://github.com/Erick0105')}>
              <Ionicons name="logo-github" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL('https://www.linkedin.com/in/erick-alves-295180235/')}>
              <Ionicons name="logo-linkedin" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={require('../../assets/sobre-nos/vicenzo-img.png')} style={styles.imagem} />
        <View style={styles.info}>
          <Text style={styles.nome}>Vicenzo Massao</Text>
          <Text style={styles.textinho}>RM 554833</Text>
          <Text style={styles.textinho}>2TDSPM</Text>
          <View style={styles.links}>
            <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL('https://github.com/fFukurou')}>
              <Ionicons name="logo-github" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL('https://www.linkedin.com/in/vicenzo-massao/')}>
              <Ionicons name="logo-linkedin" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={require('../../assets/sobre-nos/luiz-img.png')} style={styles.imagem} />
        <View style={styles.info}>
          <Text style={styles.nome}>Luiz Henrique Neri</Text>
          <Text style={styles.textinho}>RM 556864</Text>
          <Text style={styles.textinho}>2TDSPM</Text>
          <View style={styles.links}>
            <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL('https://github.com/LuizHNR')}>
              <Ionicons name="logo-github" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL('https://www.linkedin.com/in/luiz-henrique-neri-reimberg-6ab0032b8/')}>
              <Ionicons name="logo-linkedin" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1C',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    paddingBottom: 70,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#EA003D',
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#EA003D',
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  info: {
    marginLeft: 20,
    flex: 1,
    alignItems: 'center',
  },
  nome: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  textinho: {
    color: '#949494',
    fontSize: 14,
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
});
