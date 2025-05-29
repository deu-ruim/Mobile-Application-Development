import { View, Text} from 'react-native';
import { Link } from 'expo-router';

export default function Feed() {
  return (
    <View>
      <Text>Feed screen</Text>
      <Link href="../index">
        <Text>Voltar para home</Text>
      </Link>
    </View>
  );
}
