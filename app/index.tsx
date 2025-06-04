import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


export default function Index() {

  return (
    <ScrollView>
      <View>
        <View>
          <Image source={require('../assets/user.png')}/>       
        </View>
        <Text> Bem vindo ao </Text>
        <Text> Deu Ruim </Text>
      </View>
      <View>
        <Text>Escolha a forma que você vai entrar no app apertando os botões a baixo</Text>
      </View>

      <View>
        <View>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text>Logar</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
