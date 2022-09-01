import { createDrawerNavigator } from "@react-navigation/drawer";
import { GlobalStyles } from "../constants/styles";
import LogOutScreen from "../screens/LogOutScreen";
import AccountScreen from "../screens/AccountScreen";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import NewsScreen from "../screens/NewsScreen";
import MembersScreen from "../screens/MembersScreen";
const Drawer = createDrawerNavigator();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
    >
      <Drawer.Screen
        name="News"
        children={() => <NewsScreen />}
        options={{
          title: "News",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="LedenLijst"
        children={() => <MembersScreen />}
        options={{
          title: "Ledenlijst",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="AccountScreen"
        children={() => <AccountScreen />}
        options={{
          title: "My Account",
          backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen name="LogOut" component={LogOutScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
