import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/home";
import StackInicial from "./tab.routes"

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeLogin" component={Home} />
        <Stack.Screen name="MainTabs" component={StackInicial} />
    </Stack.Navigator>
  );
}