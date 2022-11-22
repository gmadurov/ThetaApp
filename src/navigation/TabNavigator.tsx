import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AuthContext from "../context/AuthContext";
import ChatScreen from "../screens/ChatScreen";
import { Divider } from "react-native-paper";
import FullContext from "../context/FullContext";
import LedenlijstScreen from "../screens/LedenlijstScreen";
import LoginScreen from "../screens/LoginScreen";
import NewsPage from "../screens/NewsPage";
import WalletUpgrateScreen from "../screens/WalletUpgrateScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
    // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   TabContentStyle: { backgroundColor: "#351401" },//   TabInactiveTintColor: "white",//   TabActiveTintColor: "#351401",    //   TabActiveBackgroundColor: "#e4baa1",// }}
    >
      <Tab.Screen
        name="News"
        component={NewsPage}
        options={{
          title: "News Pagina",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Tab.Screen
        name="FrustSchrift"
        children={() => <ChatScreen frust={true} />}
        options={{
          title: "Frustschrift",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Tab.Screen
        name="SpamSchrift"
        children={() => <ChatScreen spam={true} />}
        options={{
          title: "Spamschrift",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      <Tab.Screen
        name="LedenlijstScreen"
        component={LedenlijstScreen}
        options={{
          title: "Ledenlijst ",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      />
      {/* <Tab.Screen
        name="WalletUpgrateScreen"
        component={WalletUpgrateScreen}
        options={{
          title: "Wallet opwaderen ",
          // backgroundColor: GlobalStyles.colors.primary1,
        }}
      /> */}
    </Tab.Navigator>
  );
}
