// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
// import api from '../../../src/api/api'; 
// interface Usuario {
//   id: number;
//   username: string;
//   email: string;
//   uf: string;
//   ativo: boolean;
//   role?: string;
// }

// export default function ListaUsuarios() {
//   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
//   const [carregando, setCarregando] = useState(true);
//   const [paginaAtual, setPaginaAtual] = useState(0);
//   const [totalPaginas, setTotalPaginas] = useState(1);

//   async function carregarUsuarios(pagina: number) {
//     setCarregando(true);
//     try {
//       const resposta = await api.get(`/usuarios?page=${pagina}&size=10`); // size pode ser ajustado
//       const dados = resposta.data;

//       if (Array.isArray(dados.content)) {
//         setUsuarios(dados.content);
//         setTotalPaginas(dados.totalPages);
//         setPaginaAtual(dados.number);
//       } else {
//         Alert.alert('Erro', 'Formato inesperado da resposta da API');
//         setUsuarios([]);
//       }
//     } catch (error) {
//       console.error('Erro ao buscar usuários:', error);
//       Alert.alert('Erro', 'Não foi possível carregar a lista de usuários');
//     } finally {
//       setCarregando(false);
//     }
//   }

//   useEffect(() => {
//     carregarUsuarios(paginaAtual);
//   }, []);

//   function trocarPagina(novaPagina: number) {
//     if (novaPagina !== paginaAtual && novaPagina >= 0 && novaPagina < totalPaginas) {
//       carregarUsuarios(novaPagina);
//     }
//   }

//   if (carregando) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="red" />
//         <Text>Carregando usuários...</Text>
//       </View>
//     );
//   }

//   if (usuarios.length === 0) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Nenhum usuário encontrado.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={usuarios}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View>
//             <Text>{item.username}</Text>
//             <Text>{item.email}</Text>
//             <Text>{item.uf}</Text>
//             <Text>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
//             <Text>{item.role}</Text>
//           </View>
//         )}
//       />

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           justifyContent: 'center',
//           alignItems: 'center',
//           paddingVertical: 10,
//         }}
//       >
//         {Array.from({ length: totalPaginas }).map((_, index) => (
//           <TouchableOpacity
//             key={index}
//             onPress={() => trocarPagina(index)}
//             style={{
//               marginHorizontal: 5,
//               padding: 10,
//               backgroundColor: index === paginaAtual ? 'red' : '#eee',
//               borderRadius: 5,
//             }}
//           >
//             <Text style={{ color: index === paginaAtual ? 'white' : 'black' }}>
//               {index + 1}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/api/api';
import { Usuario } from '../../../src/types/usuario'; // caminho para o tipo

export default function Home() {
  const { id } = useLocalSearchParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null); // <<< aqui resolve
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const token = await AsyncStorage.getItem('@token');
        const response = await api.get(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchUsuario();
  }, [id]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="red" />
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <Text> Seja Bem-vindo, {usuario.username}!</Text>
      </View>
      <View>
        <Text>Dados metereologicos e etc</Text>
      </View>

      {/* <Text>Email: {usuario.email}</Text>
      <Text>UF: {usuario.uf}</Text>
      <Text>Ativo: {usuario.ativo ? 'Sim' : 'Não'}</Text>
      <Text>Role: {usuario.role}</Text> */}

      <View>
        <View>
          <Text>Conheça nosso Github</Text>
          <Text>Projeto realizado para a Global solution da Fiap</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/deu-ruim')}>
            <Text>Deu Ruim!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
