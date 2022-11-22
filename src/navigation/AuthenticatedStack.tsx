import { View, Text } from "react-native";
import React from "react";
import { GlobalStyles } from "../constants/styles";
import ProfileScreen from "../screens/ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

export type AuthenticatedStackParamsList = {
  ProfilePagina: { id: number } | undefined;
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
            <Appbar.Header style={{backgroundColor: 'white'}}>
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
    </Stack.Navigator>
  );
}
