import { Text, ScrollView, TouchableOpacity} from 'react-native';

export default function Home({ navigation }) {

    return (
    <ScrollView>
        <Text> Home (Login) </Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          <Text>Entrar</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}