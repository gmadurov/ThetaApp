import * as Contacts from "expo-contacts";

import { Avatar, Button, Menu, Searchbar, TouchableRipple } from "react-native-paper";
import { FlatList, Linking, StyleSheet, Text, View } from "react-native";
import { Member, MemberRespose } from "../models/Members";
import React, { useContext, useEffect } from "react";

import ApiContext from "../context/ApiContext";
import { DrawerParamList } from "../navigation/Navigators";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";

type MenuVisibility = {
  [key: string]: boolean | undefined;
};
export const downloadContact = async (member: Member) => {
  // ContactType: 'contactType',
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
  if (await Contacts.isAvailableAsync()) {
    const contact = {
      name: member.voornaam,
      contactType: Contacts.ContactTypes.Person,
      [Contacts.Fields.FirstName]: member.voornaam,
      [Contacts.Fields.LastName]: member.achternaam,
      [Contacts.Fields.MiddleName]: member.voorletters,
      [Contacts.Fields.Company]: "E.S.R Theta",
      [Contacts.Fields.PhoneNumbers]: member.telefoonnummer
        ? [
          {
            number: member.telefoonnummer,
            isPrimary: true,
            digits: "1234567890",
            countryCode: "PA",
            label: "main",
          },
        ]
        : [undefined],
      [Contacts.Fields.Emails]: member.emailadres ? [{ email: member.emailadres }] : undefined,
    };

    const permissions = await Contacts.requestPermissionsAsync();
    if (permissions.status === "granted") {
      let groupID;
      const data1 = await Contacts.getGroupsAsync({
        groupName: "E.S.R Theta",
      });
      if (data1.length < 1) {
        groupID = await Contacts.createGroupAsync("E.S.R Theta");
      } else {
        groupID = data1[0].id as string;
      }
      const contact_withSameName = await Contacts.getContactsAsync({
        name: `${member.voornaam} ${member.voorletters} ${member.achternaam}`,
      });
      if (
        !contact_withSameName.data.some(
          (mem) => mem.name === `${member.voornaam} ${member.voorletters} ${member.achternaam}`
        )
      ) {
        const contactID = await Contacts.addContactAsync(contact as unknown as Contacts.Contact);
        await Contacts.addExistingContactToGroupAsync(contactID, groupID);
        await Contacts.presentFormAsync(contactID, contact as unknown as Contacts.Contact);
        showMessage({
          message: "Contact toegevoegd",
          description: `${member.voornaam} ${member.achternaam} is toegevoegd aan je contacten`,
          type: "success",
          icon: "success",
        });
      } else {
        const contactID = contact_withSameName.data[0].id;
        console.log("idd 185;", contactID);
        await Contacts.addExistingContactToGroupAsync(contactID, groupID);
        await Contacts.presentFormAsync(contactID, contact as unknown as Contacts.Contact);
        showMessage({
          message: "Contact zit al in je contacten lijst",
          description: `${member.voornaam} ${member.voorletters} ${member.achternaam}`,
          type: "warning",
          icon: "warning",
        });
      }
    }
    // console.log(await Contacts.addContactAsync(contact));
  }
  // console.log(res);
  // }
};
type Props = NativeStackScreenProps<DrawerParamList, "LedenlijstScreen">;

const LedenlijstScreen = ({ route, navigation }: Props) => {
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
      `/members/${page || searchQuery || ordering ? "?" : ""}${page ? "page=" + page : ""}${page && searchQuery ? "&" : ""}${searchQuery ? "searchstring=" + searchQuery : ""
      }${ordering && (searchQuery || page) ? "&" : ""}${ordering ? "ordering=" + ordering : ""}`
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
    if (user?.id) {
      getMembers();
    }
    return () => {
      setMembers([] as Member[]);
    };
  }, [user?.id, searchQuery, page, ordering]);
  const [visible, setVisible] = useState<MenuVisibility>({});
  const _toggleMenu = (name: string) => setVisible({ ...visible, [name]: !visible[name] });
  const _getVisible = (name: string) => !!visible[name];

  const renderItem = ({ item }: { item: Member }) => {
    let avatarSize = 75;
    return (
      <TouchableRipple
        onPress={() =>
          // @ts-ignore
          navigation.navigate("AuthenticatedStack", {
            screen: "ProfilePagina",
            params: { id: item?.id },
          })
        }
      >
        <View style={styles.itemContainer}>
          {item?.foto !== null ? (
            <Avatar.Image source={{ uri: item?.foto }} size={avatarSize} />
          ) : (
            <Avatar.Text size={avatarSize} label={item.voorletters} />
          )}
          <View style={styles.itemTextContentContainer}>
            <View style={styles.itemHeaderContainer}>
              <Text style={[styles.header]} ellipsizeMode="tail" numberOfLines={1}>
                {item.voornaam} {item.achternaam}
              </Text>
            </View>
            <View style={styles.itemMessageContainer}>
              <View style={styles.flex}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  {item.opleiding}
                </Text>
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {item.ploeglidmaatschappen.map((ploeg) => ploeg.ploeg.naam).join(", ")}
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
                  onPress={() => Linking.openURL(`whatsapp://send?phone=${item.telefoonnummer}`)}
                  title={"Whatsappen"}
                  icon={"whatsapp"}
                />
                <Menu.Item
                  onPress={() => downloadContact(item)}
                  icon={"account-box-multiple-outline"}
                  title={"Contact Toevoegen"}
                />
              </Menu>
            </View>
          </View>
        </View>
      </TouchableRipple>
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
            setOrdering((nu) => (nu === "achternaam" ? "-achternaam" : "achternaam"));
          }}
          title="Order op achternaam"
        />
        <Menu.Item
          onPress={async () => {
            setOrdering((nu) => (nu === "geboortedatum" ? "-geboortedatum" : "geboortedatum"));
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
