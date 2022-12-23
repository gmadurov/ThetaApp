import React, { useContext, useEffect, useLayoutEffect } from "react";
import { Animated, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, DataTable, Switch, Text, TextInput } from "react-native-paper";
import { ActivityModel, Entry } from "../models/Activity";

import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import ApiContext from "../context/ApiContext";
import SettingsContext from "../context/SettingsContext";
import { theme } from "../context/Theme";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";

type Props = NativeStackScreenProps<AuthenticatedStackParamsList, "ActivityScreen">;

type buttonType = {
  [key: number]: boolean;
};
const ActivityScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;

  const { ApiRequest, user } = useContext(ApiContext);
  const { defaultActivityComment } = useContext(SettingsContext);
  const [activity, setActivity] = useState<ActivityModel>({} as ActivityModel);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>("");
  const [buttonDisable, setButtonDisable] = useState<buttonType>({} as buttonType);
  const _disabled = (activity: ActivityModel) => !!buttonDisable[activity.id] || false;
  const _toggleDisable = (activity: ActivityModel) =>
    setButtonDisable((prev) => ({ ...prev, [activity.id]: !prev[activity.id] }));
  const getObjects = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<ActivityModel>(`/activities/${id}/`);
    // console.log(
    //   `/activities/${page || searchQuery || ordering || status ? "?" : ""}${status ? "status=" + status : ""}${
    //     status && (ordering || searchQuery || page) ? "&" : ""
    //   }${page ? "page=" + page : ""}${page && searchQuery ? "&" : ""}${searchQuery ? "searchstring=" + searchQuery : ""}${
    //     ordering && (searchQuery || page) ? "&" : ""
    //   }${ordering ? "ordering=" + ordering : ""}`
    // );
    setActivity(() => data);
    setRefreshing(false);
  };
  useEffect(() => {
    if (user?.id) {
      setTimeout(getObjects, 500);
    }
    return () => {
      setActivity({} as ActivityModel);
    };
  }, [user?.id, navigation, id]);

  async function SignUp(activity: ActivityModel) {
    _toggleDisable(activity);
    const { res, data } = await ApiRequest<Entry>(`/activities/${activity.id}/entries/`, {
      method: "POST",
      body: JSON.stringify({
        author: {
          id: user?.id,
        },
        remark: remark || defaultActivityComment,
      }),
    });

    if (res.status === 200 || res.status === 201) {
      await ApiRequest<ActivityModel>(`/activities/${activity.id}/`, { method: "GET" }).then((response) =>
        setActivity(response.data)
      );
      showMessage({
        message: "Ingeschreven voor activiteit!",
        // @ts-ignore
        description: `Je bent ingeschreven ${data.remark ? `met de opmerking: ${data.remark}` : ""}`,
        type: "success",
        icon: "success",
        duration: 5000,
        floating: true,
      });
    } else {
      showMessage({
        message: "Aanmelden voor activiteit mislukt!",
        description: JSON.stringify(data) || `Je bent wss niet ingelogt in de app, log in en probeer het opnieuw`,
        type: "danger",
        icon: "danger",
        duration: 7000,
        floating: true,
      });
    }
    _toggleDisable(activity);
    setRemark("");
  }

  async function SignMeOut(id: number, activity: ActivityModel) {
    _toggleDisable(activity);
    const { res } = await ApiRequest<{ status: string }>(`/activities/entries/${id}/`, {
      method: "DELETE",
    });
    if (res.status === 200) {
      await ApiRequest<ActivityModel>(`/activities/${activity.id}/`, { method: "GET" }).then((response) =>
        setActivity(response.data)
      );
      showMessage({
        message: "Uitgeschreven voor activiteit!",
        type: "success",
        icon: "success",
        duration: 5000,
        floating: true,
      });
    } else {
      showMessage({
        message: "Uitschrijven voor activiteit mislukt!",
        description: `Je kunt hier klijken om het opnieuw te proberen`,
        type: "danger",
        icon: "danger",
        duration: 7000,
        floating: true,
        onPress: () => {
          SignMeOut(id, activity);
        },
      });
    }
    _toggleDisable(activity);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ navigation }) => (
        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          {/* @ts-ignore */}
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          {/* @ts-ignore */}
          <Appbar.Content title={activity.title} />
        </Appbar.Header>
      ),
    });
  }, [navigation, activity]);
  const Counts = ({ count, title }: { count: string | number; title: string }) => {
    return (
      <View>
        <Text style={[styles.tabLabelText, { color: "black" }]}>{count}</Text>
        <Text style={[styles.tabLabelNumber, { color: "black" }]}>{title}</Text>
      </View>
    );
  };
  return (
    <>
      <View style={[styles.socialRow, { justifyContent: "space-evenly" }]}>
        <Counts
          count={`${activity.no_of_entries || 0}/${
            activity.max_participants === -1 ? '∞' : activity.max_participants || 0
          } | ${activity.no_of_reserve || 0}`}
          title="Aanmeldingen"
        />
        <Counts count={["0", null, undefined].includes(activity.costs) ? "Gratis" : "€" + activity.costs} title="Kost" />
      </View>
      <View style={styles.socialRow}>
        <Counts count={dayjs(activity.event_date).format("D-M-YYYY | hh:mmA")} title="Event Datum" />
      </View>
      <View style={styles.socialRow}>
        <Counts count={dayjs(activity.registration_close).format("D-M-YYYY | hh:mmA")} title="Sluiting" />
      </View>
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getObjects();
            }}
          />
        }
        // onEndReached={getMembers}
        // onEndReachedThreshold={0.2}
      >
        <Text>{activity.description}</Text>
        {new Date(activity.registration_close).getTime() > new Date().getTime() && (
          <View style={[styles.socialRow, { justifyContent: "space-evenly" }]}>
            {/* @ts-ignore */}
            <TextInput
              style={{ flex: 1 }}
              mode={"outlined"}
              label="Opmerking"
              value={remark}
              onChangeText={(text) => setRemark(text)}
            />
            <Switch
              onValueChange={(value) =>
                value
                  ? SignUp(activity)
                  : SignMeOut(
                      activity.entries?.find((entry) => entry.author.id === user?.id)?.id ||
                        (activity.reserve?.find((entry) => entry.author.id === user?.id)?.id as number),
                      activity
                    )
              }
              value={
                activity.entries?.some((entry) => entry.author.id === user?.id) ||
                activity.reserve?.some((entry) => entry.author.id === user?.id)
                  ? true
                  : false
              }
              color={
                activity.entries?.some((entry) => entry.author.id === user?.id)
                  ? "green"
                  : activity.reserve?.some((entry) => entry.author.id === user?.id)
                  ? "orange"
                  : "red"
              }
              disabled={_disabled(activity)}
            />
          </View>
        )}
        <Text variant="titleLarge">
          Inschrijvingen{" "}
          {`${activity.no_of_entries || 0}/${
            activity.max_participants === -1 ? '∞'  : activity.max_participants || 0
          } `}
        </Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Ingeschreven</DataTable.Title>
            <DataTable.Title>Opmerking</DataTable.Title>
          </DataTable.Header>
          {activity?.entries?.map((entry) => (
            // @ts-ignore
            <DataTable.Row>
              <DataTable.Cell>{entry.author.name}</DataTable.Cell>
              <DataTable.Cell>{entry.remark}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        <Text variant="titleLarge">Reserve {activity.no_of_reserve}</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Reserve</DataTable.Title>
            <DataTable.Title>Opmerking</DataTable.Title>
          </DataTable.Header>
          {activity?.reserve?.map((entry) => (
            // @ts-ignore
            <DataTable.Row>
              <DataTable.Cell>{entry.author.name}</DataTable.Cell>
              <DataTable.Cell>{entry.remark}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    marginRight: 16,
    marginTop: 8,
  },
  tabLabelNumber: {
    color: "gray",
    fontSize: 12.5,
    textAlign: "center",
  },
  tabLabelText: {
    color: "black",
    fontSize: 22.5,
    fontWeight: "600",
    textAlign: "center",
  },
  flex: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemTextContentContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 16,
  },
  itemHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  read: {
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 16,
    alignSelf: "flex-end",
  },
  date: {
    fontSize: 12,
  },
  header: {
    fontSize: 14,
    marginRight: 8,
    flex: 1,
  },
  searchbar: {
    margin: 4,
  },
});
