import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Lemon-Regular': require('../assets/fonts/Lemon-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/user.png')} style={styles.logo} />
      </View>

      <Text style={styles.welcome}>Bem vindo ao</Text>
      <Text style={styles.title}>Deu Ruim</Text>

      <Text style={styles.subtitle}>
        Escolha a forma que você vai entrar no app apertando os botões abaixo
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginButton}>
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')} style={styles.registerButton}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
  },
  content: {
    padding: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  welcome: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Lemon-Regular',
  },
  title: {
    color: '#EA003D',
    fontSize: 36,
    fontFamily: 'Lemon-Regular',
    marginBottom: 40,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
    fontFamily: 'Lemon-Regular',
  },
  buttonsContainer: {
    gap: 30,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#EA003D',
    paddingVertical: 20,
    width: 250,
    borderRadius: 40,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#424242',
    paddingVertical: 20,
    width: 250,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Lemon-Regular',
  },
});
