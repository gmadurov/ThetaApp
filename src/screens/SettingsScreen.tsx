import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import React, { useContext, useEffect, useState } from "react";
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Checkbox, Switch, Text, TextInput, TouchableRipple } from "react-native-paper";

import ApiContext from "../context/ApiContext";
import SettingsContext, { NotificationEnum } from "../context/SettingsContext";
import { showMessage } from "react-native-flash-message";

export type NoticifationsType = {
  foto_albums: boolean;
  spams: boolean;
  frusts: boolean;
  activities: boolean;
  happen: boolean;
  news: boolean;
  // sound: NotificationEnum;
  announcements: boolean;
};

const SettingsScreen = () => {
  const { ApiRequest } = useContext(ApiContext);
  const {
    selectedNotification,
    setNotification,
    defaultActivityComment,
    defaultHapComment,
    defaultHapQuantity,
    setDefaultActivityComment,
    setDefaultHapComment,
    setDefaultHapQuantity,
  } = useContext(SettingsContext);
  const [notifications, setNotifications] = useState<NoticifationsType>({} as NoticifationsType);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  async function getNotifications() {
    const token = await registerForPushNotificationsAsync();
    setExpoPushToken(token);
    setRefreshing(true);
    const { res, data } = await ApiRequest<NoticifationsType>(`/notifications/get/`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    if (res?.status == 200) {
      setNotifications(data);
    } else {
      showMessage({
        message: "Er is iets fout gegaan met het ophalen van notificaties",
        type: "danger",
        floating: true,
      });
    }
    setRefreshing(false);
  }
  useEffect(() => {
    getNotifications();
  }, []);
  useEffect(() => {
    async function postNotifications() {
      // @ts-ignore
      delete notifications.author;
      const { res, data } = await ApiRequest<NoticifationsType>(`/notifications/`, {
        method: "PUT",
        body: JSON.stringify(notifications),
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
          description: data as unknown as string,
          type: "danger",
          duration: 500,
          floating: true,
        });
      }
    }
    // @ts-ignore
    postNotifications();
  }, [
    notifications.activities,
    notifications.announcements,
    notifications.foto_albums,
    notifications.frusts,
    notifications.happen,
    notifications.news,
    notifications.spams,
  ]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            getNotifications();
          }}
        />
      }
    >
      <View style={styles.row}>
        <Text>Foto Album notificaties</Text>
        <Switch
          value={notifications.foto_albums}
          onValueChange={(e) => setNotifications({ ...notifications, foto_albums: e })}
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
      <View style={styles.row}>
        {/* @ts-ignore */}
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="Default Activiteit Opmerking"
          value={defaultActivityComment}
          onChangeText={(text) => setDefaultActivityComment(text||'')}
        />
      </View>
      <View style={styles.row}>
        {/* @ts-ignore */}
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          value={defaultHapComment}
          label="Default Hap Opmerking"
          onChangeText={(text) => setDefaultHapComment(text||"")}
        />
      </View>
      <View style={styles.row}>
        {/* @ts-ignore */}
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="Default Hap Kwantiteit"
          value={defaultHapQuantity.toString()}
          onChangeText={(text) => setDefaultHapQuantity(parseInt(text)||0)}
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
    </ScrollView>
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
