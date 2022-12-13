// import ChatScreen from "../screens/ChatScreen";
// import LedenlijstScreen from "../screens/LedenlijstScreen";
// import NewsPage from "../screens/NewsPage";
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// const Tab = createBottomTabNavigator();

// export default function TabNavigator() {
//   return (
//     <Tab.Navigator
//     // screenOptions={{  headerStyle: { backgroundColor: "#351401" },//   headerTintColor: "white",//   sceneContainerStyle: { backgroundColor: "#3f2f25" },//   TabContentStyle: { backgroundColor: "#351401" },//   TabInactiveTintColor: "white",//   TabActiveTintColor: "#351401",    //   TabActiveBackgroundColor: "#e4baa1",// }}
//     >
//       <Tab.Screen
//         name="NewsPage"
//         component={NewsPage}
//         options={{
//           title: "News Pagina",
//           // backgroundColor: GlobalStyles.colors.primary1,
//         }}
//       />
//       <Tab.Screen
//         name="FrustSchrift"
//         //@ts-ignore
//         children={() => <ChatScreen  />}
//         options={{
//           title: "Frustschrift",
//           // backgroundColor: GlobalStyles.colors.primary1,
//         }}
//       />
//       <Tab.Screen
//         name="SpamSchrift"
//         //@ts-ignore
//         children={() => <ChatScreen/>}
//         options={{
//           title: "Spamschrift",
//           // backgroundColor: GlobalStyles.colors.primary1,
//         }}
//       />
//       <Tab.Screen
//         name="LedenlijstScreen"
//         component={LedenlijstScreen}
//         options={{
//           title: "Ledenlijst ",
//           // backgroundColor: GlobalStyles.colors.primary1,
//         }}
//       />
//       {/* <Tab.Screen
//         name="WalletUpgrateScreen"
//         component={WalletUpgrateScreen}
//         options={{
//           title: "Wallet opwaderen ",
//           // backgroundColor: GlobalStyles.colors.primary1,
//         }}
//       /> */}
//     </Tab.Navigator>
//   );
// }
