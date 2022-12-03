import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
