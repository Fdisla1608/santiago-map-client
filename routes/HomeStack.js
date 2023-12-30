import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Login from "../screens/Login";
import Profile from "../screens/Profile";

const screens = {
  Login: {
    screen: Login,
  },
  Profile: {
    screen: Profile,
  },
};

const HomeStack = createStackNavigator(screens, { headerMode: "none" });
export default createAppContainer(HomeStack);
