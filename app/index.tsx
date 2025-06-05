import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { GlobalStyles } from '../src/styles/global';



export default function Index() {

  const [fontsLoaded] = useFonts({
    'Lemon-Regular': require('../assets/fonts/Lemon-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ScrollView style={GlobalStyles.formularioScrool}>
      <View>
        <View>
          <Image source={require('../assets/user.png')}/>       
        </View>
        <Text style={[GlobalStyles.text, { color: 'white', paddingTop: 70, }]}> Bem vindo ao </Text>
        <Text style={[GlobalStyles.text, { color: '#EA003D' }]}> Deu Ruim </Text>
      </View>
      <View>
        <Text style={[GlobalStyles.text, { color: '#494949', fontSize: 15, paddingTop: 70, }]}>Escolha a forma que você vai entrar no app apertando os botões a baixo</Text>
      </View>

      <View style={GlobalStyles.botaoIndex}>
        <View style={[{ backgroundColor: '#EA003D', paddingVertical:30, width: 150, borderRadius: 40, position: 'relative', left: 65, zIndex: 2, }]}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[GlobalStyles.text, { color: 'white', }]}>Logar</Text>
          </TouchableOpacity>
        </View>
        <View style={[{ backgroundColor: '#424242', padding:30, width: 250, borderRadius: 40, }]}>
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={[GlobalStyles.text, { color: 'white', paddingLeft: 30 }]}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
