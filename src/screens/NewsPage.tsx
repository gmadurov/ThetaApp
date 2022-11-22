import {
  Avatar,
  Button,
  Card,
  Chip,
  Menu,
  Searchbar,
  TouchableRipple,
} from "react-native-paper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NewsArticle, NewsResponse } from "../models/News";
import React, { useContext, useEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import { Ionicons } from "@expo/vector-icons";
import PdfScreen from "./PdfScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import RenderMarkdown from "../components/RenderMarkdown";

type Props = NativeStackScreenProps<DrawerParamList, "NewsPage">;

const NewsPage = ({ route, navigation }: Props) => {
  const { ApiRequest, user, baseUrl } = useContext(ApiContext);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(
    [] as NewsArticle[]
  );
  const [next, setNext] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<string>("achternaam");
  const getNewsArticles = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<NewsResponse>(
      `/news/${page || ordering ? "?" : ""}${page ? "page=" + page : ""}${
        ordering && page ? "&" : ""
      }${ordering ? "ordering=" + ordering : ""}`
    );

    setNewsArticles(() => data.results);
    setNext(() =>
      data.next
        ? data?.next
            .split("/v2/news/?")[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1]
        : undefined
    );
    setPrevious(() =>
      parseInt(next as string) > 2
        ? (data?.previous
            ?.split("/v2/news/?")[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1] as string)
        : undefined
    );
    setRefreshing(false);
  };
  useEffect(() => {
    if (user?.id) {
      getNewsArticles();
    }
    return () => {
      setNewsArticles([] as NewsArticle[]);
    };
  }, [user?.id, page, ordering]);
  const [lines, setLines] = useState({} as { [key: string]: number });
  
  const renderItem = ({ item }: { item: NewsArticle }) => {
    return (
      <>
        <Card
          style={styles.card}
          mode={"elevated"}
          onPress={() =>
            setLines({ ...lines, [item.id]: lines[item.id] !== 200 ? 200 : 4 })
          }
        >
          {item.photo_url && (
            <Card.Cover
              source={{
                uri: (baseUrl.slice(0, -3) + item.photo_url) as string,
              }}
            />
          )}
          <Card.Title title={item.title} subtitle={item.subtitle} />
          <Card.Content>
            <Text ellipsizeMode="tail" numberOfLines={lines[item.id] || 4}>
              <RenderMarkdown>{item.content}</RenderMarkdown>
            </Text>
          </Card.Content>
          {item.attachment_url && (
            <Card.Actions
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Chip
                avatar={<Ionicons name={"document-attach"} size={20} />}
                onPress={() => {
                  navigation.navigate("AuthenticatedStack", {
                    screen: "PdfScreen",
                    params: {
                      uri: baseUrl.slice(0, -3) + item.attachment_url,
                      type: item.attachment_file_type,
                    },
                  });
                }}
                // style={styles.chip}
              >
                Bijlage
              </Chip>
            </Card.Actions>
          )}
        </Card>
      </>
    );
  };
  return (
    <>
      <FlatList
        data={newsArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getNewsArticles();
          setRefreshing(false);
        }}
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

export default NewsPage;

const styles = StyleSheet.create({
  container: {},
  card: {
    margin: 4,
    paddingBottom: 9,
  },
});
