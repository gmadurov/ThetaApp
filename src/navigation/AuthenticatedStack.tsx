import { View, Text } from "react-native";
import React from "react";
import { GlobalStyles } from "../constants/styles";
import ProfileScreen from "../screens/ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";
import PdfScreen from "../screens/PdfScreen";
import PhotoAlbumScreen_single from "../screens/PhotoAlbumScreen_single";
import { theme } from "../context/Theme";

export type AuthenticatedStackParamsList = {
  ProfilePagina: { id: number } | undefined;
  PdfScreen: { uri: string; type: string };
  SinglePhotoAlbum: { id: number };
};

const Stack = createNativeStackNavigator<AuthenticatedStackParamsList>();

export default function AuthenticatedStack() {
  return (
    <Stack.Navigator
      id="AuthenticadedStack"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.primary,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="ProfilePagina"
        component={ProfileScreen}
        // children={() => <ProfileScreen />}
        options={{}}
      />
      <Stack.Screen name="PdfScreen" component={PdfScreen} />
      <Stack.Screen name="SinglePhotoAlbum" component={PhotoAlbumScreen_single} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}
