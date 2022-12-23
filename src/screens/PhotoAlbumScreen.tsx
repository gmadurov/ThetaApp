import { Button, Card } from "react-native-paper";
import { FlatList, StyleSheet, Text } from "react-native";
import { PhotoAlbum, PhotoAlbumResponse } from "../models/PhotoAlbulms";
import React, { useContext, useEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import { DrawerParamList } from "../navigation/Navigators";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";

type Props = NativeStackScreenProps<DrawerParamList, "PhotoAlbumScreen">;
const PhotoAlbumScreen = ({ route, navigation }: Props) => {
  const { ApiRequest, user, baseUrl } = useContext(ApiContext);
  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([] as PhotoAlbum[]);
  const [next, setNext] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<string>("");
  const getObjects = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<PhotoAlbumResponse>(
      `/photoalbums/?page_size=30&${page ? "page=" + page : ""}${ordering && page ? "&" : ""}${
        ordering ? "ordering=" + ordering : ""
      }`
    );

    setPhotoAlbums(() => data.results);
    setNext(() =>
      data.next
        ? data?.next
            .split("/v2/photoalbums/?")[1]
            .split("&")
            .filter((x: string) => x.includes("page="))[0]
            .split("=")[1]
        : undefined
    );
    setPrevious(() =>
      data?.previous
        ? (data?.previous
            ?.split("/v2/photoalbums/?")[1]
            .split("&")
            .filter((x: string) => x.includes("page="))[0]
            .split("=")[1] as string)
        : undefined
    );
    setRefreshing(false);
  };
  useEffect(() => {
    if (user?.id) {
      getObjects();
    }
    return () => {
      setPhotoAlbums([] as PhotoAlbum[]);
    };
  }, [user?.id, page, ordering]);
  const [lines, setLines] = useState({} as { [key: string]: number });

  const renderItem = ({ item }: { item: PhotoAlbum }) => {
    return (
      <>
        <Card
          style={styles.card}
          mode={"elevated"}
          onPress={() => {
            // @ts-ignore
            navigation.navigate("AuthenticatedStack", {
              screen: "SinglePhotoAlbum",
              params: {
                id: item.id,
              },
            });
          }}
        >
          {item.photos[0] && (
            <Card.Cover
              source={{
                uri: (baseUrl.slice(0, -3) + item.photos[0].thumb) as string,
              }}
            />
          )}
          <Card.Title
            title={item.title}
            subtitle={`Door ${item.author}, ${
              item.date_edited ? "voor het laatst geupdate op " + dayjs(item.date_edited).format("D MMM YYYY") : ""
            }`}
          />
          <Card.Content>
            <Text ellipsizeMode="tail" numberOfLines={lines[item.id] || 4}>
              {dayjs(item.album_date).format("MMM D YYYY")}
            </Text>
          </Card.Content>
        </Card>
      </>
    );
  };

  return (
    <>
      <FlatList
        data={photoAlbums}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getObjects();
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

export default PhotoAlbumScreen;

const styles = StyleSheet.create({
  card: {
    margin: 4,
    paddingBottom: 9,
  },
  container: {
    paddingBottom: 50,
  },
});
