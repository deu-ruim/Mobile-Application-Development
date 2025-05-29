import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Tela direta, assume app/home.js */}
      <Drawer.Screen name="home" />

      {/* Rota stack: assume app/stack/index.js + outras telas em app/stack/ */}
      <Drawer.Screen
        name="stack"
        options={{ drawerLabel: 'Stack Screens' }}
      />
    </Drawer>
  );
}
