import { StatusBar } from "expo-status-bar";
import "./polyfills";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";

import { FullProvider } from "./context/FullContext";
import AuthContext from "./context/AuthContext";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import * as SplashScreen from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiContext from "./context/ApiContext";
import AuthStack from "./navigation/AuthStack";

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const { user, refreshToken } = useContext(ApiContext);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedTokens = await AsyncStorage.getItem("authTokens");
      if (storedTokens) {
        console.log("refresh app 1");
        await refreshToken(JSON.parse(storedTokens), true);
        console.log("refresh app 2");
      }
      setIsTryingLogin(false);
    }
    fetchToken();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    async function fetchToken() {
      if (!isTryingLogin) {
      }
    }
    fetchToken();
    // eslint-disable-next-line
  }, [isTryingLogin]);

  const onLayoutRootView = useCallback(async () => {
    if (!isTryingLogin) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }
  return <Navigation onLayout={onLayoutRootView} />;
}

function Navigation() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {!user && <AuthStack />}
      {user && <AuthenticatedStack />}
    </>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <FullProvider>
          <Root />
        </FullProvider>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
