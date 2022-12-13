import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { Platform, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Switch, Text } from "react-native-paper";

import ApiContext from "../context/ApiContext";
import { showMessage } from "react-native-flash-message";

export type NoticifationsType = {
  fotoAlbums: boolean;
  spams: boolean;
  frusts: boolean;
  activities: boolean;
  happen: boolean;
  news: boolean;
};

const SettingsScreen = () => {
  const { ApiRequest } = useContext(ApiContext);
  const [notifications, setNotifications] = useState<NoticifationsType>({} as NoticifationsType);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  useEffect(() => {
    async function getNotifications() {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);      
      const { res, data } = await ApiRequest<NoticifationsType>(`/notifications/${token}/`, { method: "GET" });
      if (res?.status == 200) {
        setNotifications(data);
      }
    }
    getNotifications();
  }, []);
  useEffect(() => {
    async function postNotifications() {
      const { data } = await ApiRequest<NoticifationsType>(`/notifications/${expoPushToken}/`, {
        method: "POST",
        body: JSON.stringify({ notifications }),
      });
      setNotifications(data);
    }
    postNotifications();
  }, [notifications]);

  useEffect(() => {}, []);
  return (
    <>
      <View style={styles.row}>
        <Text>Foto Album notificaties</Text>
        <Switch
          value={notifications.fotoAlbums}
          onValueChange={(e) => setNotifications({ ...notifications, fotoAlbums: e })}
        />
      </View>
      <View style={styles.row}>
        <Text>Nieuws notificaties</Text>
        <Switch value={notifications.news} onValueChange={(e) => setNotifications({ ...notifications, news: e })} />
      </View>
      <View style={styles.row}>
        <Text>Spam notificaties</Text>
        <Switch value={notifications.spams} onValueChange={(e) => setNotifications({ ...notifications, spams: e })} />
      </View>
      <View style={styles.row}>
        <Text>Frust notificaties</Text>
        <Switch value={notifications.frusts} onValueChange={(e) => setNotifications({ ...notifications, frusts: e })} />
      </View>
      <View style={styles.row}>
        <Text>Activiteit notificaties</Text>
        <Switch
          value={notifications.activities}
          onValueChange={(e) => setNotifications({ ...notifications, activities: e })}
        />
      </View>
      <View style={styles.row}>
        <Text>Happen notificaties</Text>
        <Switch value={notifications.happen} onValueChange={(e) => setNotifications({ ...notifications, happen: e })} />
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

async function registerForPushNotificationsAsync() {
  let token: string = "";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return "";
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
