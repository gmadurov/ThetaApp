import { View, Text } from "react-native";
import React from "react";
import { GlobalStyles } from "../constants/styles";
import ProfileScreen from "../screens/ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";
import PdfScreen from "../screens/PdfScreen";
import PhotoAlbumScreen_single from "../screens/PhotoAlbumScreen_single";

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
        headerStyle: { backgroundColor: GlobalStyles.colors.primary3 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary1 },
      }}
      >
      <Stack.Screen
        name="ProfilePagina"
        component={ProfileScreen}
        // children={() => <ProfileScreen />}
        options={{
          header: ({ navigation }) => (
            <Appbar.Header style={{ backgroundColor: "white" }}>
              {navigation.canGoBack() && (
                <Appbar.BackAction
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              )}
              <Appbar.Content title="Profile Page" />
            </Appbar.Header>
          ),
        }}
      />
      <Stack.Screen name="PdfScreen" component={PdfScreen} />
      <Stack.Screen name="SinglePhotoAlbum" component={PhotoAlbumScreen_single} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
