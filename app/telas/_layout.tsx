// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, // esconde o header padrão de cada tela dentro da tab
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'feed') {
            iconName = 'home-outline';
          } else if (route.name === 'messages') {
            iconName = 'chatbubble-ellipses-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      })}
    />
  );
}
