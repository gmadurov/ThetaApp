import * as Contacts from "expo-contacts";

import {
  Avatar,
  Button,
  Menu,
  Searchbar,
  TouchableRipple,
} from "react-native-paper";
import { FlatList, Linking, StyleSheet, Text, View } from "react-native";
import { Member, MemberRespose } from "../models/Members";
import React, { useCallback, useContext, useEffect } from "react";

import ApiContext from "../context/ApiContext";
import IconButton from "../components/ui/IconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";

type MenuVisibility = {
  [key: string]: boolean | undefined;
};
const LedenlijstScreen = () => {
  const { ApiRequest, user } = useContext(ApiContext);
  const [members, setMembers] = useState<Member[]>([] as Member[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [next, setNext] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<string>("achternaam");
  const getMembers = async () => {
    setRefreshing(true);
    const { res, data } = await ApiRequest<MemberRespose>(
      `/members/${page || searchQuery || ordering ? "?" : ""}${
        page ? "page=" + page : ""
      }${page && searchQuery ? "&" : ""}${
        searchQuery ? "searchstring=" + searchQuery : ""
      }${ordering && (searchQuery || page) ? "&" : ""}${
        ordering ? "ordering=" + ordering : ""
      }`
    );

    setMembers(() => data.results);
    setNext(() =>
      data.next
        ? data?.next
            .split("/v2/members/?")[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1]
        : undefined
    );
    setPrevious(() =>
      parseInt(next as string) > 2
        ? (data?.previous
            ?.split("/v2/members/?")[1]
            .split("&")
            .filter((x) => x.includes("page="))[0]
            .split("=")[1] as string)
        : undefined
    );
    setRefreshing(false);
  };
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      // console.log(status);
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });
        if (data.length > 0) {
          const contact = data[0];
          // console.log(contact);
        }
      }
    })();
  }, []);
  useEffect(() => {
    if (user?.id) {
      getMembers();
    }
    return () => {
      setMembers([] as Member[]);
    };
  }, [user?.id, searchQuery, page, ordering]); // ContactType: 'contactType',
  // Name: 'name',
  // FirstName: 'firstName',
  // MiddleName: 'middleName',
  // LastName: 'lastName',
  // MaidenName: 'maidenName',
  // NamePrefix: 'namePrefix',
  // NameSuffix: 'nameSuffix',
  // Nickname: 'nickname',
  // PhoneticFirstName: 'phoneticFirstName',
  // PhoneticMiddleName: 'phoneticMiddleName',
  // PhoneticLastName: 'phoneticLastName',
  // Birthday: 'birthday',
  // NonGregorianBirthday: 'nonGregorianBirthday', // IOS only
  // Emails: 'emails',
  // PhoneNumbers: 'phoneNumbers',
  // Addresses: 'addresses',
  // SocialProfiles: 'socialProfiles',
  // InstantMessageAddresses: 'instantMessageAddresses',
  // UrlAddresses: 'urlAddresses',
  // Company: 'company',
  // JobTitle: 'jobTitle',
  // Department: 'department',
  // ImageAvailable: 'imageAvailable',
  // Image: 'image',
  // RawImage: 'rawImage',
  // ExtraNames: 'extraNames',
  // Note: 'note',
  // Dates: 'dates',
  // Relationships:
  const [visible, setVisible] = useState<MenuVisibility>({});
  function _toggleMenu(name: string) {
    setVisible({ ...visible, [name]: !visible[name] });
  }
  const _getVisible = (name: string) => !!visible[name];

  const renderItem = ({ item }: { item: Member }) => {
    const downloadContact = async () => {
      if (await Contacts.isAvailableAsync()) {
        const contact = {
          id: "",
          name: item.voornaam,
          contactType: Contacts.ContactTypes.Person,
          [Contacts.Fields.FirstName]: item.voornaam,
          [Contacts.Fields.LastName]: item.achternaam,
          [Contacts.Fields.Company]: "E.S.R Thêta",
          [Contacts.Fields.PhoneNumbers]: item.telefoonnummer
            ? [
                {
                  number: item.telefoonnummer,
                  isPrimary: true,
                  digits: "1234567890",
                  countryCode: "PA",
                  label: "main",
                },
              ]
            : [undefined],
          [Contacts.Fields.Emails]: item.emailadres
            ? [{ email: item.emailadres }]
            : undefined,
          [Contacts.Fields.Image]: item.foto ? { uri: item.foto } : undefined,
          [Contacts.Fields.Department]: item.opleiding,
        };

        const permissions = await Contacts.requestPermissionsAsync();

        if (permissions.status === "granted") {
          await Contacts.addContactAsync(
            contact as unknown as Contacts.Contact
          );
          showMessage({
            message: "Contact toegevoegd",
            description: `${item.voornaam} ${item.achternaam} is toegevoegd aan je contacten`,
            type: "success",
            icon: "success",
          });
        }
        // console.log(await Contacts.addContactAsync(contact));
      }
      // console.log(res);
      // }
    };

    let avatarSize = 75;
    return (
      <View style={styles.itemContainer}>
        {item?.foto !== null ? (
          <Avatar.Image source={{ uri: item?.foto }} size={avatarSize} />
        ) : (
          <Avatar.Text size={avatarSize} label={item.voorletters} />
        )}
        <View style={styles.itemTextContentContainer}>
          <View style={styles.itemHeaderContainer}>
            <Text
              style={[styles.header]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.voornaam} {item.achternaam}
            </Text>
          </View>
          <View style={styles.itemMessageContainer}>
            <View style={styles.flex}>
              <Text ellipsizeMode="tail" numberOfLines={1}>
                {item.opleiding}
              </Text>
              <Text numberOfLines={1} ellipsizeMode="tail">
                {item.ploeglidmaatschappen
                  .map((ploeg) => ploeg.ploeg.naam)
                  .join(", ")}
              </Text>
            </View>
            <Menu
              visible={_getVisible("member" + item.id)}
              onDismiss={() => _toggleMenu("member" + item.id)}
              anchor={
                <TouchableRipple
                  onPress={() => {
                    _toggleMenu("member" + item.id);
                  }}
                >
                  <Ionicons
                    name={"ellipsis-vertical-circle-outline"}
                    color={"blue"}
                    size={24}
                    onPressFunction={() => _toggleMenu("member" + item.id)}
                    style={styles.icon}
                  />
                </TouchableRipple>
              }
            >
              <Menu.Item
                onPress={() => Linking.openURL(`tel:${item.telefoonnummer}`)}
                title={"Bellen"}
                icon={"phone-outline"}
              />
              <Menu.Item
                onPress={() =>
                  Linking.openURL(`https://wa.me/${item.telefoonnummer}`)
                }
                title={"Whatsappen"}
                icon={"whatsapp"}
              />
              <Menu.Item
                onPress={downloadContact}
                icon={"account-box-multiple-outline"}
                title={"Contact Toevoegen"}
              />
            </Menu>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <Menu
        visible={_getVisible("search")}
        onDismiss={() => _toggleMenu("search")}
        anchor={
          <Searchbar
            placeholder="Search Leden"
            onChangeText={(query: string) => setSearchQuery(query)}
            onIconPress={() => _toggleMenu("search")}
            value={searchQuery}
            style={styles.searchbar}
          />
        }
      >
        <Menu.Item
          onPress={async () => {
            setOrdering((nu) => (nu === "voornaam" ? "-voornaam" : "voornaam"));
          }}
          title="Order op voornaam"
        />
        <Menu.Item
          onPress={async () => {
            setOrdering((nu) =>
              nu === "achternaam" ? "-achternaam" : "achternaam"
            );
          }}
          title="Order op achternaam"
        />
        <Menu.Item
          onPress={async () => {
            setOrdering((nu) =>
              nu === "geboortedatum" ? "-geboortedatum" : "geboortedatum"
            );
          }}
          title="Order op gebortedatum"
        />
      </Menu>
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={[styles.flex]}
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
          <Button
            onPress={() => {
              setPage(() => previous);
            }}
            disabled={previous === undefined}
          >
            Previous
          </Button>
        }
        ListFooterComponent={
          <Button
            onPress={() => setPage(() => next)}
            disabled={next === undefined}
          >
            next
          </Button>
        }
      />
    </>
  );
};

export default LedenlijstScreen;

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
