import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Navigator from "../routes/HomeStack";

export default function App() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
