import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert, Image, TouchableOpacity, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GlobalStyles } from '../../src/styles/global.js' 

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
    <ScrollView style={GlobalStyles.somos}>
      <View style={[{ paddingBottom: 70, }]}>
        <Text style={[GlobalStyles.textSomos, { color: 'white', }]}>Quem somos!</Text>
        <Text style={[GlobalStyles.textSomos, { color: '#EA003D' }]}>Fiap</Text>
      </View>
      <View style={GlobalStyles.imagens}>
        <View>
          <Image source={require('./assets/sobre-nos/erick-img.png')}/>
        </View>
        <View style={GlobalStyles.informacoes}>
          <Text style={[GlobalStyles.text, { color: 'white', }]}>Erick Alves</Text>
          <Text style={[GlobalStyles.textinho, { color: '#494949', textAlign: 'center', }]}>RM 556862</Text>
          <Text style={[GlobalStyles.textinho, { color: '#494949', textAlign: 'center', }]}>2TDSPM</Text>
          <View style={GlobalStyles.links}>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Erick0105')}>
              <Ionicons name="logo-github" size={30} color="white" />          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/erick-alves-295180235/')}>
              <Ionicons name="logo-linkedin" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[GlobalStyles.imagens, { marginTop: 30, }]}>
        <View>
          <Image source={require('./assets/sobre-nos/vicenzo-img.png')}/>
        </View>
        <View style={[GlobalStyles.informacoes, { height: 130, marginTop: 30, }]}>
          <Text style={[GlobalStyles.text, { color: 'white', }]}>Vicenzo Massao</Text>
          <Text style={[GlobalStyles.textinho, { color: '#494949', textAlign: 'center', }]}>RM 554833</Text>
          <Text style={[GlobalStyles.textinho, { color: '#494949', textAlign: 'center', }]}>2TDSPM</Text>
          <View style={GlobalStyles.links}>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/fFukurou')}>
              <Ionicons name="logo-github" size={20} color="white" />          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/vicenzo-massao/')}>
              <Ionicons name="logo-linkedin" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[GlobalStyles.imagens, { marginTop: 80, }]}>
        <View>
          <Image source={require('./assets/sobre-nos/luiz-img.png')}/>
        </View>
        <View style={GlobalStyles.informacoes}>
          <Text style={[GlobalStyles.text, { color: 'white', }]}>Luiz Henrique Neri</Text>
          <Text style={[GlobalStyles.textinho, { color: '#494949', textAlign: 'center', }]}>RM 556864</Text>
          <Text style={[GlobalStyles.textinho, { color: '#494949', textAlign: 'center', }]}>2TDSPM</Text>
          <View style={GlobalStyles.links}>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/LuizHNR')}>
              <Ionicons name="logo-github" size={20} color="white" />          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/luiz-henrique-neri-reimberg-6ab0032b8/')}>
              <Ionicons name="logo-linkedin" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
