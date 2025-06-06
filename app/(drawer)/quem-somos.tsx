import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert, Image, TouchableOpacity, Linking} from 'react-native';
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
    <ScrollView>
      <View>
        <Text>Quem somos!</Text>
        <Text>Fiap</Text>
      </View>
      <View>
        <View>
          <Image source={require('../../assets/sobre-nos/erick-img.png')}/>
        </View>
        <View>
          <Text>Erick Alves</Text>
          <Text>RM 556862</Text>
          <Text>2TDSPM</Text>
          <View>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Erick0105')}>
              <Ionicons name="logo-github" size={20} color="black" />          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/erick-alves-295180235/')}>
              <Ionicons name="logo-linkedin" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <View>
          <Image source={require('../../assets/sobre-nos/vicenzo-img.png')}/>
        </View>
        <View>
          <Text>Vicenzo Massao</Text>
          <Text>RM 554833</Text>
          <Text>2TDSPM</Text>
          <View>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/fFukurou')}>
              <Ionicons name="logo-github" size={20} color="black" />          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/vicenzo-massao/')}>
              <Ionicons name="logo-linkedin" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <View>
          <Image source={require('../../assets/sobre-nos/luiz-img.png')}/>
        </View>
        <View>
          <Text>Luiz Henrique Neri</Text>
          <Text>RM 556864</Text>
          <Text>2TDSPM</Text>
          <View>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/LuizHNR')}>
              <Ionicons name="logo-github" size={20} color="black" />          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/luiz-henrique-neri-reimberg-6ab0032b8/')}>
              <Ionicons name="logo-linkedin" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
