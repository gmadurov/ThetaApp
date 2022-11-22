import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React, { useContext } from "react";

import AuthContext from "../context/AuthContext";
import LedenlijstScreen from "../screens/LedenlijstScreen";
import ChatNavigator from "./ChatNavigator";
import NewsPage from "../screens/NewsPage";
import WalletUpgrateScreen from "../screens/WalletUpgrateScreen";
import { AuthenticatedStackParamsList } from "./AuthenticatedStack";
import { useNavigation } from "@react-navigation/native";

export type DrawerParamList = {
  Chat: undefined;
  LoginScreen: undefined;
  NewsPage: undefined;
  WalletUpgrateScreen: undefined;
  LedenlijstScreen: undefined;
  [key: string]: undefined | object;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  const { user, logoutFunc } = useContext(AuthContext);
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      initialRouteName="NewsPage"
      id="DrawerStack"
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
      drawerContent={(props: any) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="My profile"
              onPress={() =>
                navigation.navigate("AuthenticatedStack", {
                  screen: "ProfilePagina",
                  params: { id: user?.id },
                })
              }
            />
            <DrawerItem
              label="Uitlogen"
              onPress={async () => await logoutFunc()}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="NewsPage"
        component={NewsPage}
        options={{
          title: "News Pagina",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="LedenlijstScreen"
        component={LedenlijstScreen}
        options={{
          title: "Ledenlijst ",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      {/* <Drawer.Screen
        name="WalletUpgrateScreen"
        component={WalletUpgrateScreen}
        options={{
          title: "Wallet opwaderen ",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
