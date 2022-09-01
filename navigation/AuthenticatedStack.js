import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigator from "./DrawerNavigator";


const Stack = createNativeStackNavigator();

export default function AuthenticatedStack() {
  return (
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
      <Stack.Screen name="LoginPage" component={LoginScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
