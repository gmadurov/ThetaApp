import { Avatar, Button, Divider } from "react-native-paper";
import { ChatItem, SpamResponse } from "../models/Spams";
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import RenderMarkdown from "../components/RenderMarkdown";
import { baseUrl } from "../context/AuthContext";
import dayjs from "dayjs";

const ChatScreen = ({ frust, spam }: { frust?: boolean; spam?: boolean }) => {
  const { ApiRequest, user } = useContext(ApiContext);

  const [chats, setChats] = useState<ChatItem[]>([] as ChatItem[]);
  const [next, setNext] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<string | undefined>();
  const [pageSize, setPageSize] = useState<number>(25);
  const [ordering, setOrdering] = useState<string>("pub_date");

  const getSigns = (n: number) => {
    var SpamIcons;
    if (n === 1) {
      return ["add-outline"];
    } else if (n > 1 && n < 50) {
      return ["#"];
    } else if (n >= 50 && n < 125) {
      return ["star-half"];
    } else if (n >= 125 && n < 1000) {
      var remain =
        n % 250; /**Calculate remainder to determine if half stars are needed */
      var div = (n - remain) / 250; /**Calculate amount of hundred's */
      /** Check if amount of spams has a remainder */
      if (remain < 125) {
        var i = 0;
        var arr = [];
        while (i < div) {
          arr.push("star");
          i++;
        }
        SpamIcons = arr;
      } else {
        var i = 0;
        var arr = [];
        while (i < div) {
          arr.push("star");
          i++;
        }
        arr.push("star-half");
        SpamIcons = arr;
      }
      return SpamIcons;
    } else if (n >= 1000 && n < 5000) {
      var remain =
        n %
        1000; /**Calculate remainder to determine if half stars are needed */
      var div = (n - remain) / 1000; /**Calculate amount of hundred's */
      var i = 0;
      var arr = [];
      while (i < div) {
        arr.push("trophy");
        i++;
      }
      SpamIcons = arr;
      return SpamIcons;
    } else {
      return ["medal"];
    }
  };

  const getSpams = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<SpamResponse>(
      `/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/${
        page || ordering ? "?" : ""
      }${page ? "page=" + page : ""}
      ${ordering && page ? "&" : ""}${ordering ? "order_by=" + ordering : ""}`
    );
    console.log(data.results);

    setChats(() => data.results);
    setNext(() =>
      data.next
        ? data?.next
            .split(
              `/v2/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/?`
            )[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1]
        : undefined
    );
    setPrevious(() =>
      parseInt(next as string) > 2
        ? (data?.previous
            ?.split(
              `/v2/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/?`
            )[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1] as string)
        : undefined
    );
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.id) {
      getSpams();
    }
    return () => {
      setChats([] as ChatItem[]);
    };
  }, [user?.id, page, ordering]);

  const renderItem = ({ item }: { item: ChatItem }) => {
    let avatarSize = 75;
    return (
      <View style={styles.itemContainer}>
        {item?.author.photo_url !== null ? (
          <Avatar.Image
            source={{ uri: baseUrl().slice(0, -3) + item?.author.photo_url }}
            size={avatarSize}
          />
        ) : (
          <Avatar.Text size={avatarSize} label={item.author.name} />
        )}
        <View style={styles.itemTextContentContainer}>
          <View style={styles.TopRowHeader}>
            <Text
              style={[styles.header]}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {item.author.name}
              <Text
                style={{
                  fontSize: 14,
                  marginRight: 8,
                  flex: 1,
                  fontWeight: "normal",
                }}
              >
                | {dayjs(item.pub_date).format("D-M-YYYY | hh:mmA")}
              </Text>
            </Text>

            <Text style={[styles.date]}>
              {frust
                ? getSigns(item.author.frust_count).map((x, i) =>
                    x !== "#" ? (
                      <Ionicons
                        key={"spamTrophy" + i + item.id}
                        name={x}
                        size={styles.date.fontSize}
                      />
                    ) : (
                      <Text
                        key={"spamTrophy" + i + item.id}
                        style={styles.date}
                      >
                        #
                      </Text>
                    )
                  )
                : getSigns(item.author.spam_count).map((x, i) =>
                    x !== "#" ? (
                      <Ionicons
                        key={"spamTrophy" + i + item.id}
                        name={x}
                        size={styles.date.fontSize}
                      />
                    ) : (
                      <Text
                        key={"spamTrophy" + i + item.id}
                        style={styles.date}
                      >
                        #
                      </Text>
                    )
                  )}
              {frust ? item.author.frust_count : item.author.spam_count}
            </Text>
          </View>
          <View style={styles.itemMessageContainer}>
            <View style={styles.flex}>
              <RenderMarkdown>{item.text}</RenderMarkdown>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getSpams();
          setRefreshing(false);
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
              <Button
                onPress={() => setPage(() => next)}
                disabled={next === undefined}
              >
                next
              </Button>
            )}
          </>
        }
      />
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  },
  itemTextContentContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 16,
  },
  TopRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
  },
  header: {
    fontSize: 14,
    marginRight: 8,
    flex: 1,
    fontWeight: "bold",
  },
  searchbar: {
    margin: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#CED0CE",
    margin: 16,
  },
});
