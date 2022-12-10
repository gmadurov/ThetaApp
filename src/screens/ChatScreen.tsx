import { Avatar, Button, Divider, IconButton, TextInput } from "react-native-paper";
import { ChatItem, SpamResponse } from "../models/Spams";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import RenderMarkdown from "../components/RenderMarkdown";
import dayjs from "dayjs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatParamList } from "../navigation/Navigators";
type Props = NativeStackScreenProps<ChatParamList, "FrustSchrift" | "SpamSchrift">;

const ChatScreen = ({ route, navigation }: Props) => {
  const [frust, spam] = [route.name === "FrustSchrift", route.name === "SpamSchrift"];
  const { ApiRequest, user, baseUrl } = useContext(ApiContext);
  const [chats, setChats] = useState<ChatItem[]>([] as ChatItem[]);
  const [next, setNext] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<string>("pub_date");
  const [text, setText] = useState<string>("");

  const getChat = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<SpamResponse>(
      `/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/${page || ordering ? "?" : ""}${page ? "page=" + page : ""}
      ${ordering && page ? "&" : ""}${ordering ? "order_by=" + ordering : ""}`
    );
    // console.log(data.results);

    setChats(() => data.results);
    setNext(() =>
      data.next
        ? data?.next
            .split(`/v2/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/?`)[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1]
        : undefined
    );
    setPrevious(() =>
      parseInt(next as string) > 2
        ? (data?.previous
            ?.split(`/v2/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/?`)[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1] as string)
        : undefined
    );
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.id) {
      getChat();
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
          <Avatar.Image source={{ uri: baseUrl.slice(0, -3) + item?.author.photo_url }} size={avatarSize} />
        ) : (
          <Avatar.Text size={avatarSize} label={item.author.name} />
        )}
        <View style={styles.itemTextContentContainer}>
          <View style={styles.TopRowHeader}>
            <Text
              style={[styles.header]}
              ellipsizeMode="tail"
              numberOfLines={2}
              onPress={() => {
                navigation.navigate("AuthenticatedStack", {
                  screen: "ProfilePagina",
                  params: { id: item?.author.id },
                });
              }}
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
                {" "}
                | {dayjs(item.pub_date).format("D-M-YYYY | hh:mmA")}
              </Text>
            </Text>

            <Text style={[styles.date]}>
              {frust
                ? getSigns(item.author.frust_count).map((x, i) =>
                    x !== "code-slash-outline" ? (
                      <Ionicons
                        key={`spamTrophy: ${i} ${item.id} ${x}`}
                        // @ts-ignore
                        name={x}
                        size={styles.date.fontSize}
                      />
                    ) : (
                      <Text key={`spamHash: ${i} ${item.id} ${x}`} style={styles.date}>
                        #
                      </Text>
                    )
                  )
                : getSigns(item.author.spam_count).map((x, i) =>
                    x !== "code-slash-outline" ? (
                      <Ionicons
                        key={`spamTrophy: ${i} ${item.id} ${x}`}
                        // @ts-ignore
                        name={x}
                        size={styles.date.fontSize}
                      />
                    ) : (
                      <Text key={`spamHash: ${i} ${item.id} ${x}`} style={styles.date}>
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

  const createChat = async () => {
    if (text.length > 0) {
      const { res, data } = await ApiRequest<ChatItem>(`/${!!spam ? "spams" : ""}${!!frust ? "frusts" : ""}/`, {
        method: "POST",
        body: JSON.stringify({ text: text }),
      });
      if (res.status === 201) {
        setText("");
        await getChat();
      }
    }
  };

  return (
    <>
      <TextInput
        mode="flat"
        placeholder={`${!!spam ? "Spam" : ""}${!!frust ? "Frust" : ""}`}
        value={text}
        onChangeText={(text) => setText(text)}
        right={
          <TextInput.Icon
            icon="upload-outline"
            size={20}
            onPress={createChat}
            // this is needed for typescript to not complain
            // once react-native-paper fixes this, this can be removed
            onPointerEnter={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeave={undefined}
            onPointerLeaveCapture={undefined}
            onPointerMove={undefined}
            onPointerMoveCapture={undefined}
            onPointerCancel={undefined}
            onPointerCancelCapture={undefined}
            onPointerDown={undefined}
            onPointerDownCapture={undefined}
            onPointerUp={undefined}
            onPointerUpCapture={undefined}
          />
        }
        // this is needed for typescript to not complain
        // once react-native-paper fixes this, this can be removed
        onPointerEnter={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeave={undefined}
        onPointerLeaveCapture={undefined}
        onPointerMove={undefined}
        onPointerMoveCapture={undefined}
        onPointerCancel={undefined}
        onPointerCancelCapture={undefined}
        onPointerDown={undefined}
        onPointerDownCapture={undefined}
        onPointerUp={undefined}
        onPointerUpCapture={undefined}
        cursorColor={undefined}
      />
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => `chatItem: ${item.id.toString()}`}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getChat();
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
const getSigns = (n: number) => {
  var SpamIcons;
  if (n === 1) {
    return ["add-outline"];
  } else if (n > 1 && n < 50) {
    return ["code-slash-outline"];
  } else if (n >= 50 && n < 125) {
    return ["star-half"];
  } else if (n >= 125 && n < 1000) {
    var remain = n % 250; /**Calculate remainder to determine if half stars are needed */
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
    var remain = n % 1000; /**Calculate remainder to determine if half stars are needed */
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
