import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Checkbox, Switch, Text, TouchableRipple } from "react-native-paper";

import ApiContext from "../context/ApiContext";
import SettingsContext, { NotificationEnum } from "../context/SettingsContext";
import { showMessage } from "react-native-flash-message";

export type NoticifationsType = {
  fotoAlbums: boolean;
  spams: boolean;
  frusts: boolean;
  activities: boolean;
  happen: boolean;
  news: boolean;
  sound: NotificationEnum;
  announcements: boolean;
};

const SettingsScreen = () => {
  const { ApiRequest } = useContext(ApiContext);
  const { selectedNotification, setNotification } = useContext(SettingsContext);
  const [notifications, setNotifications] = useState<NoticifationsType>({} as NoticifationsType);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  useEffect(() => {
    async function getNotifications() {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      const { res, data } = await ApiRequest<NoticifationsType>(`/notifications/get/`, {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      if (res?.status == 200) {
        setNotifications(data);
      }
    }
    getNotifications();
  }, []);
  useEffect(() => {
    async function postNotifications() {
      const { res, data } = await ApiRequest<NoticifationsType>(`/notifications/`, {
        method: "POST",
        body: JSON.stringify({ notifications }),
      });
      if (res?.status == 200) {
        setNotifications(data);
        showMessage({
          message: "Notificaties opgeslagen",
          type: "success",
          duration: 500,
          floating: true,
        });
      } else {
        showMessage({
          message: "Notificaties niet opgeslagen",
          description: data as unknown as string ,
          type: "danger",
          duration: 500,
          floating: true,
        });
      }
    }
    postNotifications();
  }, [notifications]);

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
      <View style={styles.row}>
        <Text>Mededeling notificaties</Text>
        <Switch
          value={notifications.announcements}
          onValueChange={(e) => setNotifications({ ...notifications, announcements: e })}
        />
      </View>
      {/* <Text variant="titleLarge"> Notificatie Geluiden</Text> */}
      {/* {Object.entries(NotificationEnum).map(([key, value], i) => (
        <TouchableRipple
          style={styles.row}
          key={i}
          onPress={() => {
            setNotifications({ ...notifications, sound: value });
            setNotification(value as NotificationEnum);
            schedulePushNotification({
              trigger: { seconds: 1 },
              content: { title: key.replace("_", " "), body: "Test voor notificatie geluid", data: {}, sound: value },
            });
          }}
        >
          <>
            <Text>{key.replace("_", " ")}</Text>
            <Checkbox
              status={notifications.sound == value ? "checked" : "unchecked"}
              onPress={() => {
                setNotification(value as NotificationEnum);
                setNotifications({ ...notifications, sound: value });
                schedulePushNotification({
                  trigger: { seconds: 1 },
                  content: { title: key.replace("_", " "), body: "Test voor notificatie geluid", data: {}, sound: value },
                });
              }}
            />
          </>
        </TouchableRipple>
      ))} */}
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

async function schedulePushNotification(message: {
  content: { title: string; body: string; data: { [key: string]: any }; sound: string };
  trigger: { seconds: number };
}) {
  await Notifications.scheduleNotificationAsync(message);
}

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
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@gusmadvol/esr-theta", // do not change this it will break notifications in production
      })
    ).data;
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
