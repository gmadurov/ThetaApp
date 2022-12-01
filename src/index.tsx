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
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import jwt_decode from "jwt-decode";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabNavigator from "./navigation/TabNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import AuthenticatedStack from "./navigation/AuthenticatedStack";

export type AppParamsList = {
  Login: undefined;
  Drawer: undefined;
  Tab: undefined;
  AuthenticatedStack: undefined;
};

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(0, 104, 116)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(151, 240, 255)",
    onPrimaryContainer: "rgb(0, 31, 36)",
    secondary: "rgb(74, 98, 103)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(205, 231, 236)",
    onSecondaryContainer: "rgb(5, 31, 35)",
    tertiary: "rgb(82, 94, 125)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(218, 226, 255)",
    onTertiaryContainer: "rgb(14, 27, 55)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(250, 253, 253)",
    onBackground: "rgb(25, 28, 29)",
    surface: "rgb(250, 253, 253)",
    onSurface: "rgb(25, 28, 29)",
    surfaceVariant: "rgb(219, 228, 230)",
    onSurfaceVariant: "rgb(63, 72, 74)",
    outline: "rgb(111, 121, 122)",
    outlineVariant: "rgb(191, 200, 202)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(46, 49, 50)",
    inverseOnSurface: "rgb(239, 241, 241)",
    inversePrimary: "rgb(79, 216, 235)",
    elevation: {
      level0: "transparent",
      level1: "rgb(238, 246, 246)",
      level2: "rgb(230, 241, 242)",
      level3: "rgb(223, 237, 238)",
      level4: "rgb(220, 235, 237)",
      level5: "rgb(215, 232, 234)",
    },
    surfaceDisabled: "rgba(25, 28, 29, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 29, 0.38)",
    backdrop: "rgba(41, 50, 52, 0.4)",
  },
};

const Stack = createNativeStackNavigator<AppParamsList>();

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();

function AuthRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary2 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary1 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    </Stack.Navigator>
  );
}

function AuthenticatedRoutes({ isTryingLogin }: { isTryingLogin: boolean }) {
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
          headerStyle: { backgroundColor: GlobalStyles.colors.primary3 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: GlobalStyles.colors.primary1 },
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

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const { refreshToken, setUser } = useContext(ApiContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = JSON.parse((await AsyncStorage.getItem("authTokens")) as string) as AuthToken;
      // console.log("index 111", JSON.parse(storedTokens || "{}"));
      // await AsyncStorage.clear()
      // console.log(storedTokens ? true : false);

      if (storedTokens) {
        setUser(storedTokens.user);
        if ((jwt_decode(storedTokens.access_token as string) as TokenInfo).exp < Date.now()) {
          setIsTryingLogin(false);
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

function Navigation({ onLayout, isTryingLogin }: { onLayout: () => Promise<void>; isTryingLogin: boolean }) {
  const { user } = useContext(AuthContext);

  return <>{!user?.id ? <AuthRoutes /> : <AuthenticatedRoutes isTryingLogin={isTryingLogin} />}</>;
}
// messages
// "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
export default function App() {
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
