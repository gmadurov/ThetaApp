import React, { useEffect } from "react";
import { theme } from "../context/Theme";

import AuthenticatedStack from "./AuthenticatedStack";
import TabNavigator from "./ChatNavigator";
import DrawerNavigator from "./DrawerNavigator";
import { Stack } from "./Navigators";

export function AuthenticatedRoutes({ isTryingLogin }: { isTryingLogin: boolean }) {
  // const Settings = useContext(SettingsContext);
  useEffect(() => {
    async function fetchToken() {
      if (!isTryingLogin) {
        // await Purchase.GET();
        // await Settings.
      }
    }
    fetchToken();
    // eslint-disable-next-line
  }, [isTryingLogin]);

  return (
    <>
      <Stack.Navigator
        // initialRouteName="AuthenticatedStack"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary3 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: theme.colors.primary1 },
        }}
      >
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AuthenticatedStack"
          component={AuthenticatedStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
