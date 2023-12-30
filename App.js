import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";

import Map from "./screens/Map";
import User from "./screens/User";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Mapa"
          component={Map}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={User}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
