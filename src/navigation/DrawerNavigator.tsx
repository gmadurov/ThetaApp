import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React, { useContext } from "react";

import AuthContext from "../context/AuthContext";
import ChatScreen from "../screens/ChatScreen";
import { Divider } from "react-native-paper";
import FullContext from "../context/FullContext";
import LedenlijstScreen from "../screens/LedenlijstScreen";
import LinkCardScreen from "../screens/LinkCardScreen";
import LoginScreen from "../screens/LoginScreen";
import NFCContext from "../context/NFCContext";
import NewsPage from "../screens/NewsPage";
import WalletUpgrateScreen from "../screens/WalletUpgrateScreen";

const Drawer = createDrawerNavigator();

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  const { user, logoutFunc } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
      drawerContent={(props: any) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Uitlogen"
              onPress={async () => await logoutFunc()}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="News"
        component={NewsPage}
        options={{
          title: "News Pagina",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="FrustSchrift"
        children={() => <ChatScreen frust={true} />}
        options={{
          title: "Frustschrift",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Drawer.Screen
        name="SpamSchrift"
        children={() => <ChatScreen spam={true} />}
        options={{
          title: "Spamschrift",
          // backgroundColor: GlobalStyles.colors.primary1,
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
