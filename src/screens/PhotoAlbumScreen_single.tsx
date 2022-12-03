import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Photo, PhotoAlbum, PhotoAlbumResponse } from "../models/PhotoAlbulms";
import ApiContext from "../context/ApiContext";
import dayjs from "dayjs";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
  ViewToken,
  GestureResponderEvent,
  Share,
  SafeAreaView,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Divider,
  Menu,
  Modal,
  Portal,
  Provider,
  ThemeProvider,
  TouchableRipple,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
// import Carousel, { Pagination } from 'react-native-snap-carousel';
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import { showMessage } from "react-native-flash-message";
import { theme } from "../context/Theme";

const { width, height } = Dimensions.get("window");
type Props = NativeStackScreenProps<AuthenticatedStackParamsList, "SinglePhotoAlbum">;
type ContextualMenuCoord = { x: number; y: number };
type MenuVisibility = {
  [key: string]: boolean | undefined;
};

const PhotoAlbumScreen_single = ({ route, navigation }: Props) => {
  const { ApiRequest, user, baseUrl } = useContext(ApiContext);
  const [contextualMenuCoord, setContextualMenuCoor] = useState<ContextualMenuCoord>({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState<MenuVisibility>({});
  const [photoAlbum, setPhotoAlbum] = useState<PhotoAlbum>({} as PhotoAlbum);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [indexSelected, setIndexSelected] = useState(0);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const SPACING = 10;
  const THUMB_SIZE = 80;
  const getObjects = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<PhotoAlbum>(`/photoalbums/${route.params.id}/`);
    setPhotoAlbum(() => data);
    setRefreshing(false);
  };
  const _handleLongPress = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    setContextualMenuCoor({
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    });
    setVisible({ menu3: true });
  };
  useEffect(() => {
    if (user?.id) {
      getObjects();
    }
    return () => {
      setPhotoAlbum({} as PhotoAlbum);
    };
  }, [navigation, route.params.id]);
  const _getModal = () => !!modalVisible;
  const _toggleModal = () => setModalVisible(!modalVisible);
  const _toggleMenu = (name: string) => () => setVisible({ ...visible, [name]: !visible[name] });
  const _getVisible = (name: string) => !!visible[name];
  const _getLoading = (name: string | number) => !!loading[name];
  const _toggleLoading = (name: string | number) => setLoading({ ...loading, [name]: !loading[name] });

  const carouselRef = useRef<ScrollView>(null);
  const flatListRef_display = useRef<FlatList<Photo> | null>(null);
  const flatListRef_Modal = useRef<FlatList<Photo> | null>(null);
  const flatListRef_thumb = useRef<FlatList<Photo> | null>(null);
  const onTouchThumbnail = (id: number, photoId: string | number) => {
    if (id === indexSelected) return;
    carouselRef?.current?.scrollTo({ x: (indexSelected * height) / 2, y: 0, animated: true });
    flatListRef_display?.current?.scrollToOffset({
      offset: id * THUMB_SIZE,
      animated: true,
    });
    flatListRef_Modal?.current?.scrollToOffset({
      offset: id * THUMB_SIZE,
      animated: true,
    });
    flatListRef_thumb?.current?.scrollToOffset({
      offset: id * THUMB_SIZE,
      animated: true,
    });
  };

  const onSelect = (id: number, photoId: string | number) => {
    setIndexSelected(id);
    setSelectedPhotoId(photoId);
    flatListRef_Modal?.current?.scrollToIndex({
      index: id,
      animated: true,
      viewPosition: 0.5,
    });
    flatListRef_thumb?.current?.scrollToIndex({
      index: id,
      animated: true,
      viewPosition: 0.5,
    });
  };
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
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          {/* @ts-ignore */}
          {navigation.canGoBack() && <Appbar.BackAction onPress={() => navigation.goBack()} />}
          {/* @ts-ignore */}
          <Appbar.Content title={photoAlbum.title} />
        </Appbar.Header>
      ),
    });
  }, [navigation, photoAlbum.title]);
  return (
    <>
      <Portal>
        <Modal
          // animationType="slide"
          // transparent={true}
          style={styles.modal}
          visible={_getModal()}
          onDismiss={() => _toggleModal()}
        >
          <Ionicons
            name="ellipsis-vertical-outline"
            size={45}
            color="orange"
            style={{ zIndex: 10, top: 10, right: 60, position: "absolute" }}
            onPress={_handleLongPress}
          />
          <Ionicons
            name="close"
            size={50}
            color="orange"
            style={{ zIndex: 10, top: 10, right: 10, position: "absolute" }}
            onPress={() => {
              _toggleModal();
            }}
          />
          <FlatList
            ref={flatListRef_Modal}
            horizontal={true}
            data={photoAlbum.photos}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: "space-between",
            }}
            getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
            initialScrollIndex={indexSelected}
            keyExtractor={(item) => item.id.toString()}
            snapToInterval={width}
            snapToAlignment="center"
            decelerationRate={"fast"}
            onScrollToIndexFailed={() => {
              flatListRef_Modal?.current?.scrollToEnd();
            }}
            // onViewableItemsChanged={useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
            //   setIndexSelected(viewableItems[0]?.index || 0);
            //   setSelectedPhotoId(viewableItems[0]?.item.id);
            //   flatListRef_thumb?.current?.scrollToIndex({
            //     index: viewableItems[0]?.index as number,
            //     animated: true,
            //     viewPosition: 0.5,
            //   });
            // }, [])}
            renderItem={({ item: object, index }) => (
              <View key={`ViewPhoto-${object.id}-${index}`}>
                <ReactNativeZoomableView
                  zoomEnabled={true}
                  maxZoom={1.5}
                  minZoom={0.5}
                  zoomStep={0.25}
                  initialZoom={0.95}
                  bindToBorders={true}
                  // onZoomAfter={this.logOutZoomState}
                  style={{ width: width, height: height }}
                >
                  <Menu visible={_getVisible("menu3")} onDismiss={_toggleMenu("menu3")} anchor={contextualMenuCoord}>
                    <Menu.Item
                      onPress={() => {
                        Share.share({
                          title: `E.S.R Theta: ${object.id}`,
                          // message: baseUrl.slice(0, -3) + object.url,
                          url: baseUrl.slice(0, -3) + object.url,
                        })
                          .then((err) =>
                            showMessage({ message: "Shared", type: "success", duration: 1500, icon: "success" })
                          )
                          .catch((err) =>
                            showMessage({ message: "Failed to Share", type: "danger", duration: 1500, icon: "danger" })
                          );
                      }}
                      title="Share"
                    />
                    <Menu.Item onPress={() => {}} title="Item 2" />
                    <View style={{ height: "1px", backgroundColor: theme.colors.backdrop }} />
                    <Menu.Item onPress={() => {}} title="Item 3" disabled />
                  </Menu>

                  <Image
                    // onLoadStart={() => _toggleLoading(object.id)}
                    // onLoadEnd={() => _toggleLoading(object.id)}
                    key={`photo-${object.id}-${index}`}
                    source={{
                      uri: baseUrl.slice(0, -3) + object.url,
                    }}
                    defaultSource={require("../assets/loadingBoat.jpg")}
                    style={{ width: width, height: height, resizeMode: "center" }}
                  />
                </ReactNativeZoomableView>
              </View>
            )}
          />
          <FlatList
            ref={flatListRef_thumb}
            horizontal={true}
            data={photoAlbum.photos}
            style={{ position: "absolute", bottom: 10 }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: SPACING,
              position: "absolute", bottom: 10
            }}
            initialScrollIndex={indexSelected}
            keyExtractor={(item) => item.id.toString()}
            onScrollToIndexFailed={() => {
              flatListRef_thumb?.current?.scrollToEnd();
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  onSelect(index, item.id);
                }}
              >
                <Image
                  style={{
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    marginRight: SPACING,
                    borderRadius: 16,
                    borderWidth: index === indexSelected ? 4 : 0.75,
                    borderColor: index === indexSelected ? "orange" : "white",
                  }}
                  defaultSource={require("../assets/loadingBoat.jpg")}
                  source={{ uri: baseUrl.slice(0, -3) + item.url }}
                />
              </TouchableOpacity>
            )}
          />
        </Modal>
      </Portal>
      <Provider>
        <FlatList
          ref={flatListRef_display}
          data={photoAlbum.photos}
          renderItem={({ item: object, index }) => (
            <TouchableRipple
              style={styles.imageContainer}
              onPress={() => {
                _toggleModal();
                onSelect(index, object.id);
              }}
            >
              <Image
                source={{ uri: baseUrl.slice(0, -3) + object.thumb }}
                defaultSource={require("../assets/loadingBoat.jpg")}
                style={[styles.image, { backgroundColor: colors[Math.floor(Math.random() * colors.length)] }]}
              />
            </TouchableRipple>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => flatListRef_display?.current?.scrollToEnd()}
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
