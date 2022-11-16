import "./polyfills";
import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";

import FlashMessage, { showMessage } from "react-native-flash-message";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import TokenInfo, { AuthToken, AuthToken_decoded } from "./models/AuthToken";

import ApiContext from "./context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./context/AuthContext";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { FullProvider } from "./context/FullContext";
import { GlobalStyles } from "./constants/styles";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import ProductScreen from "./screens/ProductScreen";
import SettingsContext from "./context/SettingsContext";
import { StatusBar } from "expo-status-bar";
import { User } from "./models/Users";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import jwtDecode from "jwt-decode";
import jwt_decode from "jwt-decode";

const Stack = createNativeStackNavigator();

function AuthStack() {
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

function AuthenticatedStack({ isTryingLogin }: { isTryingLogin: boolean }) {
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
      </Stack.Navigator>
    </>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const { refreshToken, setUser } = useContext(ApiContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = JSON.parse(
        (await AsyncStorage.getItem("authTokens")) as string
      ) as AuthToken;
      // console.log("index 111", JSON.parse(storedTokens || "{}"));
      // await AsyncStorage.clear()
      // console.log(storedTokens ? true : false);

      if (storedTokens) {
        setUser(storedTokens.user);
        if (
          (jwt_decode(storedTokens.access_token as string) as TokenInfo).exp <
          Date.now()
        ) {
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
  return (
    <Navigation onLayout={onLayoutRootView} isTryingLogin={isTryingLogin} />
  );
}

function Navigation({
  onLayout,
  isTryingLogin,
}: {
  onLayout: () => Promise<void>;
  isTryingLogin: boolean;
}) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {!user?.id ? (
        <AuthStack />
      ) : (
        <AuthenticatedStack isTryingLogin={isTryingLogin} />
      )}
    </>
  );
}
// messages
// "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar />
          <FullProvider>
            <Root />
          </FullProvider>
          <FlashMessage position="top" />
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
}