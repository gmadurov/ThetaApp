import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type AppParamsList = {
  Login: undefined;
  Drawer: undefined;
  Tab: undefined;
  AuthenticatedStack: undefined;
};

export const Stack = createNativeStackNavigator<AppParamsList>();

export type ChatParamList = {
  FrustSchrift: undefined;
  SpamSchrift: undefined;
  [key: string]: any;
};

export const Tab = createBottomTabNavigator<ChatParamList>();

export type DrawerParamList = {
  "Spam/Frust": undefined;
  LoginScreen: undefined;
  NewsPage: undefined;
  WalletUpgrateScreen: undefined;
  LedenlijstScreen: undefined;
  PhotoAlbumScreen: undefined;
  Settings: undefined;
  // [key: string]: undefined | object; //remove if it doesnt cause any other ts-errors
};
export const Drawer = createDrawerNavigator<DrawerParamList>();
