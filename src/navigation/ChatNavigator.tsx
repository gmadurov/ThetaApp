import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../screens/ChatScreen";
import { Appbar } from "react-native-paper";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../context/Theme";
import { theme } from "../context/Theme";
export type ChatParamList = {
  FrustSchrift: undefined;
  SpamSchrift: undefined;
  [key: string]: any;
};

const Tab = createBottomTabNavigator<ChatParamList>();

export default function TabNavigator() {
  const navigation = useNavigation();
  const Header = ({ title }: { title: string }) => (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }} theme={theme}>
      {/* @ts-ignore */}
      <Appbar.Action
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer);
        }}
        icon={"menu"}
      />
      {/* @ts-ignore */}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );

  return (
    <Tab.Navigator
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   TabContentStyle: { backgroundColor: "#351401" },//   TabInactiveTintColor: "white",//   TabActiveTintColor: "#351401",    //   TabActiveBackgroundColor: "#e4baa1",// }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "FrustSchrift") {
            return <Ionicons name={focused ? "alert-outline" : "alert-outline"} size={size} color={color} />;
          } else if (route.name === "SpamSchrift") {
            return <Ionicons name={focused ? "help" : "help"} size={size} color={color} />;
          }
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "tomato",
      })}
    >
      <Tab.Screen
        name="FrustSchrift"
        component={ChatScreen}
        options={{
          title: "Frustschrift",
          header: () => <Header title="Frustschrift" />,
        }}
      />
      <Tab.Screen
        name="SpamSchrift"
        component={ChatScreen}
        options={{
          title: "Spamschrift",
          header: () => <Header title="Spamschrift" />,
        }}
      />
    </Tab.Navigator>
  );
}
