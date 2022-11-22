import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Photo, PhotoAlbum, PhotoAlbumResponse } from "../models/PhotoAlbulms";
import ApiContext from "../context/ApiContext";
import dayjs from "dayjs";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";
import { TouchableOpacity, View, Text, Image, FlatList, Dimensions, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
// import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthenticatedStackParamsList, "SinglePhotoAlbum">;
const PhotoAlbumScreen_single = ({ route, navigation }: Props) => {
  const { ApiRequest, user, baseUrl } = useContext(ApiContext);
  const [photoAlbum, setPhotoAlbum] = useState<PhotoAlbum>({} as PhotoAlbum);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const getObjects = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<PhotoAlbum>(`/photoalbums/${route.params.id}/`);

    setPhotoAlbum(() => data);
    setRefreshing(false);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ navigation }) => (
        <Appbar.Header style={{ backgroundColor: "white" }}>
          {navigation.canGoBack() && (
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
            />
          )}
          <Appbar.Content title={photoAlbum.title} />
        </Appbar.Header>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoAlbum, navigation, route]);
  useEffect(() => {
    if (user?.id) {
      getObjects();
    }
    return () => {
      setPhotoAlbum({} as PhotoAlbum);
    };
  }, [navigation, route.params.id]);

  const renderItem = ({ item: object }: { item: Photo }) => {
    // style={{ width: 100, height: 100 }}
    // pick random color
    const colors = [
      "#f0f0f0",
      "#e0e0e0",
      "#d0d0d0",
      "#c0c0c0",
      "#b0b0b0",
      "#a0a0a0",
      "#909090",
      "#808080",
      "#707070",
      "#606060",
      "#505050",
      "#404040",
      "#303030",
      "#202020",
      "#101010",
      "#000000",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: baseUrl.slice(0, -3) + object.url }} style={[styles.image, { backgroundColor: color }]} />
      </View>
    );
  };
  return (
    <FlatList
      data={photoAlbum.photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      // contentContainerStyle={styles.container}
      refreshing={refreshing}
      numColumns={2}
      onRefresh={async () => {
        setRefreshing(true);
        await getObjects();
        setRefreshing(false);
      }}
    />
  );
};

export default PhotoAlbumScreen_single;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#F5FCFF",
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
      x: 0,
      y: 0,
    },
  },

  card: {
    margin: 4,
    paddingBottom: 9,
  },
  image: {
    width: width / 2,
    height: height / 2,
    flex: 1,
    resizeMode: "cover",
  },
  imageContainer: {
    width: width / 2,
    height: height / 3,
    overflow: "hidden",
  },
});
