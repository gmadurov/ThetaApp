import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import React, { useContext, useEffect, useRef, useState } from "react";

import ApiContext from "../context/ApiContext";
import AuthContext from "../context/AuthContext";
import { AuthRoutes } from "./UnAuthenticatedRoutes";
import { AuthenticatedRoutes } from "./Authenticated";
import { Platform } from "react-native";
import SettingsContext from "../context/SettingsContext";
import { Subscription } from "expo-modules-core";
import { showMessage } from "react-native-flash-message";
import { string } from "prop-types";

export function Navigation({ onLayout, isTryingLogin }: { onLayout: () => Promise<void>; isTryingLogin: boolean }) {
  const { user } = useContext(AuthContext);
  const { ApiRequest } = useContext(ApiContext);
  const { defaultHapQuantity, defaultHapComment, defaultActivityComment } = useContext(SettingsContext);

  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>({} as Subscription);
  const responseListener = useRef<Subscription>({} as Subscription);

  useEffect(() => {
    async function getNotifications() {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      const { res, data } = await ApiRequest(`/notifications/get/`, { method: "POST", body: JSON.stringify({ token }) });
      if (res?.status !== 200) {
        const { res, data } = await ApiRequest(`/notifications/`, {
          method: "POST",
          body: JSON.stringify({ token: token, user: user?.id }),
        });
        if (res?.status !== 200) {
          showMessage({
            message: "Er is iets fout gegaan met het aanmelden voor notificaties",
            type: "danger",
            floating: true,
          });
        }
      }
    }
    getNotifications();
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) =>
      setNotification(notification)
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const {
        data: { hap, activity },
        title,
        body,
      } = response.notification.request.content;
      if (activity) {
        const { res, data } = await ApiRequest<
          | {
              id: number;
              author: {
                id: number;
                name: string;
              };
              remark: string;
            }
          | string
        >(`/activities/${activity}/entries/`, {
          method: "POST",
          body: JSON.stringify({
            author: {
              id: user?.id,
            },
            remark: defaultActivityComment || "",
          }),
        });
        console.log(res, data);

        if (res.status === 200 || res.status === 201) {
          showMessage({
            message: "Ingeschreven voor activiteit!",
            // @ts-ignore
            description: `Je bent ingeschreven ${data.remark ? `met de opmerking: ${data.remark}` : ""}`,
            type: "success",
            icon: "success",
            duration: 5000,
            floating: true,
          });
        } else if (typeof data === "string") {
          showMessage({
            message: "Aanmelden voor activiteit mislukt!",
            description: data || `Je bent wss niet ingelogt in de app, log in en probeer het opnieuw`,
            type: "danger",
            icon: "danger",
            duration: 7000,
            floating: true,
          });
          await schedulePushNotification({
            content: {
              title: title || "Probeer opnieuw in te schrijven",
              body: body ? body + " (Dit is om opnieuw te kunnen proberen als het valt)" : "",
              data: { activity },
            },
            trigger: { seconds: 15 },
          });
        }
      }
      if (hap) {
        const { res, data } = await ApiRequest<{
          id: number;
          holder: {
            id: number;
            name: string;
            ledenbase_id: number;
          };
          quantity: number;
          comment: string;
        }>(`/happen/${hap}/leden/`, {
          method: "POST",
          body: JSON.stringify({
            holder: {
              ledenbase_id: user?.id,
            },
            quantity: defaultHapQuantity || 1,
            comment: defaultHapComment || "",
          }),
        });
        if (res.status === 200 || res.status === 201) {
          showMessage({
            message: "Ingeschreven voor hap!",
            description: `Je bent ${data.quantity} ingeschreven ${data.comment ? `met de opmerking: ${data.comment}` : ""}`,
            type: "success",
            icon: "success",
            duration: 5000,
            floating: true,
          });
        } else {
          showMessage({
            message: "Aanmelden voor hap mislukt!",
            description: `Je bent wss niet ingelogt in de app, log in en probeer het opnieuw`,
            type: "danger",
            icon: "danger",
            duration: 7000,
            floating: true,
          });
          await schedulePushNotification({
            content: {
              title: title || "Probeer opnieuw in te schrijven",
              body: body ? body + " (Dit is om opnieuw te kunnen proberen als het valt)" : "",
              data: { hap },
            },
            trigger: { seconds: 15 },
          });
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return <>{!user?.id ? <AuthRoutes /> : <AuthenticatedRoutes isTryingLogin={isTryingLogin} />}</>;
}

async function schedulePushNotification(message: {
  content: { title: string; body: string; data: { [key: string]: any } };
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
