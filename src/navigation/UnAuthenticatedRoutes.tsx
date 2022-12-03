import React from 'react';
import { theme } from "../context/Theme";

import LoginScreen from "../screens/LoginScreen";
import { Stack } from "./Navigators";

export function AuthRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary2 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: theme.colors.primary1 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    </Stack.Navigator>
  );
}