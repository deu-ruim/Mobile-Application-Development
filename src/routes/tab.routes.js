import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Desastres from '../screens/desastres';
import CriarDesastre from '../screens/criarDesastre';

const Tab = createBottomTabNavigator();

export default function TabRoutes({ route }) {
  const initialRouteName = route?.params?.initialRouteName || 'tabDesastre';

  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#9F9999',
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#bbb',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarIconStyle: {
        marginBottom: 4,
      },
     }} initialRouteName={initialRouteName}>
      <Tab.Screen
          name="tabDesastre"
          options={{
            tabBarLabel: "Desastres",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color}/>
            ),
          }}
        >
          {(props) => <Desastres {...props} />}
      </Tab.Screen>


      <Tab.Screen
        name="tabCriarDesastre"
        component={CriarDesastre}
        options={{
          tabBarLabel: "CriarDesastre",
          tabBarIcon: ({ color, size }) => (
            <Feather name="info" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}