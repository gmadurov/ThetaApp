import "./polyfills";
import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";

import FlashMessage, { showMessage } from "react-native-flash-message";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import TokenInfo, { AuthToken, AuthToken_decoded } from "./models/AuthToken";

import ApiContext from "./context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./context/AuthContext";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { FullProvider } from "./context/FullContext";
import { GlobalStyles } from "./constants/styles";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import jwt_decode from "jwt-decode";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabNavigator from "./navigation/TabNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import AuthenticatedStack from "./navigation/AuthenticatedStack";
import { useAppTheme } from "./context/Theme";
import { Navigation } from "./navigation/Navigation";
import { User } from "./models/Users";

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const { refreshToken, setUser, setAuthTokens, setAuthTokensDecoded } = useContext(ApiContext);
  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = JSON.parse((await AsyncStorage.getItem("authTokens")) as string) as AuthToken;
      // console.log("index 111", JSON.parse(storedTokens || "{}"));
      // await AsyncStorage.clear()
      const allkeys = await AsyncStorage.getAllKeys();
      console.log(allkeys);

      if (storedTokens) {
        setUser(storedTokens.user);
        if ((jwt_decode(storedTokens.access_token as string) as TokenInfo).exp < Date.now()) {
          setIsTryingLogin(false);
          setAuthTokens(storedTokens);
          setAuthTokensDecoded({
            access_token: jwt_decode(storedTokens.access_token as string),
            user: storedTokens.user as User,
            refresh_token: jwt_decode(storedTokens.refresh_token as string),
          });
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
