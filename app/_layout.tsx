import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerTitle: '',          // tira o título
        headerShadowVisible: false,  // opcional, remove a sombra do header
      }}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Main' }} />
      <Drawer.Screen name="telas" options={{ drawerLabel: 'Telas de Teste' }} />
    </Drawer>
  );
}
