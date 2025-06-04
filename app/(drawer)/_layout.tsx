import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="[id]/pag-user" options={{ title: 'Página Usuário' }} />
      <Drawer.Screen name="quem-somos" options={{ title: 'Quem Somos' }} />
      <Drawer.Screen name="[id]/alerta" options={{ title: 'Alerta' }} />
      <Drawer.Screen name="[id]/home" options={{ title: 'Home' }} />
      <Drawer.Screen name="sair" options={{ title: 'Sair' }}/>
    </Drawer>
  );
}
