import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Root() {
  return (
    <View>
      <Link href="/home/messages">
        <Text>Usando mais de uma navegação</Text>
      </Link>
    </View>
  );
}
