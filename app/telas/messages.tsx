import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Messages() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mensagens</Text>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={{ color: 'blue', marginTop: 10 }}>Voltar para a Main</Text>
      </TouchableOpacity>
    </View>
  );
}
