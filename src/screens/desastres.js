import { Text, ScrollView, TouchableOpacity} from 'react-native';

export default function Desastres({ navigation }) {

    return (
    <ScrollView>
        <Text> Te mostrar o tamanho do desastre </Text>
        <Text> Ass: Erick</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HomeLogin')}>
          <Text>Sair</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}