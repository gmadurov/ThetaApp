import * as Contacts from "expo-contacts";

import { Avatar, Button, Menu, Searchbar, Switch, Text, TouchableRipple } from "react-native-paper";
import { FlatList, Linking, StyleSheet, View } from "react-native";
import { ActivityModel, ActivityResponse, Entry } from "../models/Activity";
import React, { useContext, useEffect } from "react";

import ApiContext from "../context/ApiContext";
import { DrawerParamList } from "../navigation/Navigators";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";
import { theme } from "../context/Theme";
import SettingsContext from "../context/SettingsContext";

type Props = NativeStackScreenProps<DrawerParamList, "Activities">;

type buttonType = {
  [key: number]: boolean;
};
const ActivityScreen = ({ route, navigation }: Props) => {
  const { ApiRequest, user } = useContext(ApiContext);
  const { defaultActivityComment } = useContext(SettingsContext);
  const [activities, setActivities] = useState<ActivityModel[]>([] as ActivityModel[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [next, setNext] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<string>("");
  const [status, setStatus] = useState<string>("future");
  const [buttonDisable, setButtonDisable] = useState<buttonType>({} as buttonType);
  const _disabled = (activity: ActivityModel) => !!buttonDisable[activity.id] || false;
  const _toggleDisable = (activity: ActivityModel) =>
    setButtonDisable((prev) => ({ ...prev, [activity.id]: !prev[activity.id] }));
  const getMembers = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<ActivityResponse>(
      `/activities/${page || searchQuery || ordering || status ? "?" : ""}${status ? "status=" + status : ""}${
        status && (ordering || searchQuery || page) ? "&" : ""
      }${page ? "page=" + page : ""}${page && searchQuery ? "&" : ""}${searchQuery ? "searchstring=" + searchQuery : ""}${
        ordering && (searchQuery || page) ? "&" : ""
      }${ordering ? "ordering=" + ordering : ""}`
    );
    // console.log(
    //   `/activities/${page || searchQuery || ordering || status ? "?" : ""}${status ? "status=" + status : ""}${
    //     status && (ordering || searchQuery || page) ? "&" : ""
    //   }${page ? "page=" + page : ""}${page && searchQuery ? "&" : ""}${searchQuery ? "searchstring=" + searchQuery : ""}${
    //     ordering && (searchQuery || page) ? "&" : ""
    //   }${ordering ? "ordering=" + ordering : ""}`
    // );
    setActivities(() => data.results);
    setNext(() =>
      data.next
        ? data?.next
            .split("/v2/activities/?")[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1]
        : undefined
    );
    setPrevious(() =>
      data?.previous
        ? (data?.previous
            ?.split("/v2/activities/?")[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1] as string)
        : undefined
    );
    setRefreshing(false);
  };
  useEffect(() => {
    if (user?.id) {
      setTimeout(getMembers, 500);
    }
    return () => {
      setActivities([] as ActivityModel[]);
    };
  }, [user?.id, searchQuery, page, ordering]);

  async function SignUp(activity: ActivityModel) {
    _toggleDisable(activity);
    const { res, data } = await ApiRequest<Entry>(`/activities/${activity.id}/entries/`, {
      method: "POST",
      body: JSON.stringify({
        author: {
          id: user?.id,
        },
        remark: defaultActivityComment || "",
      }),
    });

    if (res.status === 200 || res.status === 201) {
      await ApiRequest<ActivityModel>(`/activities/${activity.id}/`, { method: "GET" }).then((response) =>
        setActivities((acts) => acts.map((act) => (act.id === activity.id ? response.data : act)))
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
  }

  async function SignMeOut(id: number, activity: ActivityModel) {
    _toggleDisable(activity);
    const { res } = await ApiRequest<{ status: string }>(`/activities/entries/${id}/`, {
      method: "DELETE",
    });
    if (res.status === 200) {
      await ApiRequest<ActivityModel>(`/activities/${activity.id}/`, { method: "GET" }).then((response) =>
        setActivities((acts) => acts.map((act) => (act.id === activity.id ? response.data : act)))
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

  const renderItem = ({ item }: { item: ActivityModel }) => {
    return (
      <TouchableRipple
      // onPress={() =>
      // @ts-ignore
      //   navigation.navigate("AuthenticatedStack", {
      //     screen: "ProfilePagina",
      //     params: { id: item?.id },
      //   })
      // }
      >
        <View style={styles.itemContainer}>
          <View style={styles.itemTextContentContainer}>
            <View style={styles.itemHeaderContainer}>
              {/* style={[styles.header]} */}
              <Text ellipsizeMode="tail" numberOfLines={1} variant="titleMedium">
                {item.title}
              </Text>
            </View>
            <View style={styles.itemMessageContainer}>
              <View style={styles.flex}>
                <Text ellipsizeMode="tail" numberOfLines={1} variant="bodyMedium">
                  {"€" + item.costs} {item.description}
                </Text>
                <Text numberOfLines={1} ellipsizeMode="tail" variant="bodySmall">
                  {item.no_of_entries}/{item.max_participants === -1 ? <Ionicons name="infinite" /> : item.max_participants}{" "}
                  | {item.no_of_reserve}
                </Text>
              </View>
            </View>
          </View>

          <Switch
            onValueChange={(value) =>
              value
                ? SignUp(item)
                : SignMeOut(
                    item.entries.find((entry) => entry.author.id === user?.id)?.id ||
                      (item.reserve.find((entry) => entry.author.id === user?.id)?.id as number),
                    item
                  )
            }
            value={
              item.entries.some((entry) => entry.author.id === user?.id) ||
              item.reserve.some((entry) => entry.author.id === user?.id)
                ? true
                : false
            }
            color={
              item.entries.some((entry) => entry.author.id === user?.id)
                ? "green"
                : item.reserve.some((entry) => entry.author.id === user?.id)
                ? "orange"
                : "red"
            }
            disabled={_disabled(item)}
          />
        </View>
      </TouchableRipple>
    );
  };
  return (
    <>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString()}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getMembers();
          setRefreshing(false);
        }}
        // onEndReached={getMembers}
        // onEndReachedThreshold={0.2}
        ListHeaderComponent={
          <>
            {previous !== undefined && (
              <Button
                onPress={() => {
                  setPage(() => previous);
                }}
                disabled={previous === undefined}
              >
                Previous
              </Button>
            )}
          </>
        }
        ListFooterComponent={
          <>
            {next !== undefined && (
              <Button onPress={() => setPage(() => next)} disabled={next === undefined}>
                next
              </Button>
            )}
          </>
        }
      />
    </>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  avatar: {
    marginRight: 16,
    marginTop: 8,
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
