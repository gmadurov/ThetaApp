import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Photo, PhotoAlbum, PhotoAlbumResponse } from "../models/PhotoAlbulms";
import ApiContext from "../context/ApiContext";
import dayjs from "dayjs";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";
import { TouchableOpacity, View, Text, Image, FlatList, Dimensions, StyleSheet, ScrollView } from "react-native";
import { Appbar, Modal, Portal, Provider, TouchableRipple } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
// import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width, height } = Dimensions.get("window");
type ModalVisibility = { [key: string]: boolean };
type Props = NativeStackScreenProps<AuthenticatedStackParamsList, "SinglePhotoAlbum">;
const PhotoAlbumScreen_single = ({ route, navigation }: Props) => {
  const { ApiRequest, user, baseUrl } = useContext(ApiContext);
  const [photoAlbum, setPhotoAlbum] = useState<PhotoAlbum>({} as PhotoAlbum);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [indexSelected, setIndexSelected] = useState(0);
  const [modalVisible, setModalVisible] = useState<ModalVisibility>({});
  const SPACING = 10;
  const THUMB_SIZE = 80;
  const getObjects = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<PhotoAlbum>(`/photoalbums/${route.params.id}/`);

    setPhotoAlbum(() => data);
    setRefreshing(false);
  };
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     header: ({ navigation }) => (
  //       <Appbar.Header style={{ backgroundColor: "white" }}>
  //         {navigation.canGoBack() && (
  //           <Appbar.BackAction
  //             onPress={() => {
  //               navigation.goBack();
  //             }}
  //           />
  //         )}
  //         <Appbar.Content title={photoAlbum.title} />
  //       </Appbar.Header>
  //     ),
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [photoAlbum, navigation, route]);
  useEffect(() => {
    if (user?.id) {
      getObjects();
    }
    return () => {
      setPhotoAlbum({} as PhotoAlbum);
    };
  }, [navigation, route.params.id]);
  const _getVisible = (name: string | number) => !!modalVisible[name];
  const _toggleMenu = (name: string | number) => setModalVisible({ ...modalVisible, [name]: !modalVisible[name] });
  const carouselRef = useRef<FlatList<Photo>>();
  const flatListRef = useRef<FlatList<Photo>>();
  const onTouchThumbnail = (id: number) => {
    if (id === indexSelected) return;
    carouselRef?.current?.scrollToIndex({ index: id });
  };
  const onSelect = (indexSelected: number) => {
    setIndexSelected(indexSelected);

    flatListRef?.current?.scrollToOffset({
      offset: indexSelected * THUMB_SIZE,
      animated: true,
    });
  };
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
      <>
        <Portal>
          <Modal
            // animationType="slide"
            // transparent={true}
            style={styles.modal}
            visible={_getVisible(object.id)}
            onDismiss={() => _toggleMenu(object.id)}
          >
            <ScrollView
              contentContainerStyle={{
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
              onScrollToTop={() => _toggleMenu(object.id)}
            >
              <Ionicons
                name="close"
                size={50}
                color="orange"
                style={{ zIndex: 10, top: 100, right: 0 }}
                onPress={() => {
                  _toggleMenu(object.id);
                }}
              />
              <Image
                source={{ uri: baseUrl.slice(0, -3) + object.url }}
                style={{ width: width, height: height, resizeMode: "center" }}
              />

              {/* <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onScroll={(e) => {
                  _toggleMenu(object.id);
                }}
                scrollEventThrottle={16}
              >
                {photoAlbum.photos.map((photo) => (
                  <Image
                    source={{ uri: baseUrl.slice(0, -3) + photo.thumb }}
                    style={{ width: 50, height: 50, resizeMode: "contain" }}
                  />
                ))}
              </ScrollView> */}
              <FlatList
                horizontal={true}
                data={photoAlbum.photos}
                style={{ position: "absolute", bottom: 80 }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: SPACING,
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity activeOpacity={0.9}>
                    <Image
                      style={{
                        width: THUMB_SIZE,
                        height: THUMB_SIZE,
                        marginRight: SPACING,
                        borderRadius: 16,
                        borderWidth: index === indexSelected ? 4 : 0.75,
                        borderColor: index === indexSelected ? "orange" : "white",
                      }}
                      source={{ uri: baseUrl.slice(0, -3) + item.url }}
                    />
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </Modal>
        </Portal>
        <TouchableRipple
          style={styles.imageContainer}
          onPress={() => {
            _toggleMenu(object.id);
            onSelect(object.id);
          }}
        >
          <Image source={{ uri: baseUrl.slice(0, -3) + object.thumb }} style={[styles.image, { backgroundColor: color }]} />
        </TouchableRipple>
      </>
    );
  };
  return (
    <>
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
      <Provider>
        <FlatList
          ref={flatListRef}
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
      </Provider>
    </>
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
    // overflow: "hidden",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
});
