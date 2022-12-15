import "react-native-gesture-handler";
import "./polyfills";

import * as SplashScreen from "expo-splash-screen";

import * as Notifications from "expo-notifications";
import React, { useCallback, useContext, useLayoutEffect, useState } from "react";
import FlashMessage, { showMessage } from "react-native-flash-message";
import TokenInfo, { AuthToken } from "./models/AuthToken";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import jwt_decode from "jwt-decode";
import { Provider as PaperProvider } from "react-native-paper";
import ApiContext from "./context/ApiContext";
import { FullProvider } from "./context/FullContext";
import { useAppTheme } from "./context/Theme";
import { Navigation } from "./navigation/Navigation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const { refreshToken, setUser } = useContext(ApiContext);
  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = JSON.parse((await AsyncStorage.getItem("authTokens")) as string) as AuthToken;
      if (storedTokens) {
        setUser(storedTokens.user);
        if ((jwt_decode(storedTokens.access_token as string) as TokenInfo).exp < Date.now()) {
          setIsTryingLogin(false);
        }
        if ((jwt_decode(storedTokens.refresh_token as string) as TokenInfo).exp < Date.now()) {
          await refreshToken(storedTokens);
        }
        showMessage({
          message: `Authentication woord refreshed`,
          description: ``,
          type: "info",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
        await refreshToken(storedTokens);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
    // eslint-disable-next-line
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isTryingLogin) {
      // This tells the splash screen to hide immediately! If we call this after `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead, we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }
  return <Navigation onLayout={onLayoutRootView} isTryingLogin={isTryingLogin} />;
}

// messages
// "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
export default function App() {
  const theme = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {/* <SafeAreaView style={{ flex: 1, marginBottom: 0}}> */}
        <StatusBar />
        <FullProvider>
          <Root />
        </FullProvider>
        <FlashMessage position="top" />
        {/* </SafeAreaView> */}
      </NavigationContainer>
    </PaperProvider>
  );
}
