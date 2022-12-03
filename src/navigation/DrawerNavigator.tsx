import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import React, { useContext } from "react";
import { Appbar } from "react-native-paper";
import AuthContext from "../context/AuthContext";
import { theme } from "../context/Theme";
import LedenlijstScreen from "../screens/LedenlijstScreen";
import NewsPage from "../screens/NewsPage";
import PhotoAlbumScreen from "../screens/PhotoAlbumScreen";
import ChatNavigator from "./ChatNavigator";
import { Drawer } from "./Navigators";

/** the list of screens that will be reachable via the drawer( the menu you can open to the left of the screen) */
const DrawerNavigator = () => {
  const { user, logoutFunc } = useContext(AuthContext);
  return (
    <Drawer.Navigator
      // initialRouteName="NewsPage"
      id="DrawerStack"
      // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   drawerContentStyle: { backgroundColor: "#351401" },//   drawerInactiveTintColor: "white",//   drawerActiveTintColor: "#351401",    //   drawerActiveBackgroundColor: "#e4baa1",// }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="My profile"
            onPress={() =>
              props.navigation.navigate("AuthenticatedStack", {
                screen: "ProfilePagina",
                params: { id: user?.id },
              })
            }
          />
          <DrawerItem label="Uitlogen" onPress={async () => await logoutFunc()} />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="PhotoAlbumScreen"
        component={PhotoAlbumScreen}
        options={{
          title: "Foto Albums",
          header: ({ navigation }) => (
            <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
              {/* @ts-ignore */}
              <Appbar.Action
                onPress={() => {
                  navigation.dispatch(DrawerActions.openDrawer);
                }}
                icon={"menu"}
              />
              {/* @ts-ignore */}
              <Appbar.Content title="Foto Albums" />
            </Appbar.Header>
          ),
        }}
      />
      <Drawer.Screen
        name="NewsPage"
        component={NewsPage}
        options={{
          title: "Nieuws",
        }}
      />
      <Drawer.Screen
        name="Spam/Frust"
        component={ChatNavigator}
        options={{
          title: "Spam en Frusten",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="LedenlijstScreen"
        component={LedenlijstScreen}
        options={{
          title: "Ledenlijst",
          header: ({ navigation }) => (
            <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
              {/* @ts-ignore */}
              <Appbar.Action
                onPress={() => {
                  navigation.dispatch(DrawerActions.openDrawer);
                }}
                icon={"menu"}
              />
              {/* @ts-ignore */}
              <Appbar.Content title="Ledenlijst" />
            </Appbar.Header>
          ),
        }}
      />
      {/* <Drawer.Screen
        name="WalletUpgrateScreen"
        component={WalletUpgrateScreen}
        options={{
          title: "Wallet opwaderen ",
          // backgroundColor: theme.colors.primary1,
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
