import * as React from "react";

import { Animated, Dimensions, Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, Avatar, Card, IconButton, List } from "react-native-paper";
import { useContext, useLayoutEffect, useState } from "react";

import ApiContext from "../context/ApiContext";
import AuthContext from "../context/AuthContext";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";
import { Link } from "@react-navigation/native";
import { Member } from "../models/Members";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "../models/Users";
import dayjs from "dayjs";
import { downloadContact } from "./LedenlijstScreen";
import { theme } from "../context/Theme";

type UserMember = {
  user: User;
  member: Member;
};

type Props = NativeStackScreenProps<AuthenticatedStackParamsList, "ProfilePagina">;
function ProfileScreen({ route, navigation }: Props) {
  const { baseUrl, user } = useContext(AuthContext);
  const { ApiRequest } = useContext(ApiContext);
  const [userMember, setUserMember] = useState<UserMember>({} as UserMember);
  const [refreshing, setRefreshing] = useState(false);
  const getUserMember = async () => {
    setRefreshing(true);
    const { res: resMember, data: dataMember } = await ApiRequest<Member>(`/members/${route.params?.id || user.id}/`);
    const { res: resUser, data: dataUser } = await ApiRequest<User>(`/users/${route.params?.id || user.id}/`);
    if (resUser.status === 200 && resMember.status === 200) {
      setUserMember({ member: dataMember, user: dataUser });
    }
    setRefreshing(false);
  };
  useLayoutEffect(() => {
    getUserMember();
    navigation.setOptions({
      header: ({ navigation }) => (
        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          {navigation.canGoBack() && (
            // @ts-ignore
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
            />
          )}
          {/* @ts-ignore */}
          <Appbar.Content title="Profile Page" />
        </Appbar.Header>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.id, user.id]);

  let avatarSize = 120;
  const RenderContactHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.userRow}>
          {userMember.user?.photo_url !== null ? (
            <Avatar.Image
              style={styles.userImage}
              source={{
                uri: baseUrl.slice(0, -3) + userMember.user?.photo_url,
              }}
              size={avatarSize}
            />
          ) : (
            <Avatar.Text size={avatarSize} label={userMember.user?.name} style={styles.userImage} />
          )}
          <View style={styles.userNameRow}>
            <Text style={styles.userNameText}>
              {userMember.member?.voornaam} {userMember.member?.tussenvoegsel} {userMember.member?.achternaam}
            </Text>
          </View>
          <View style={styles.userBioRow}>
            <Text style={styles.userBioText}>{userMember.member?.opleiding}</Text>
          </View>
        </View>
        <View style={styles.socialRow}>
          <View style={styles.socialIcon}>
            <IconButton
              size={30}
              iconColor="#56ACEE"
              icon="whatsapp"
              onPress={() => Linking.openURL(`whatsapp://send?phone=${userMember.member?.telefoonnummer}`)} onPointerEnter={undefined} onPointerEnterCapture={undefined} onPointerLeave={undefined} onPointerLeaveCapture={undefined} onPointerMove={undefined} onPointerMoveCapture={undefined} onPointerCancel={undefined} onPointerCancelCapture={undefined} onPointerDown={undefined} onPointerDownCapture={undefined} onPointerUp={undefined} onPointerUpCapture={undefined}            />
          </View>
          <View style={styles.socialIcon}>
            <IconButton
              size={30}
              iconColor="#56ACEE"
              icon="account-plus"
              onPress={() => downloadContact(userMember.member)} onPointerEnter={undefined} onPointerEnterCapture={undefined} onPointerLeave={undefined} onPointerLeaveCapture={undefined} onPointerMove={undefined} onPointerMoveCapture={undefined} onPointerCancel={undefined} onPointerCancelCapture={undefined} onPointerDown={undefined} onPointerDownCapture={undefined} onPointerUp={undefined} onPointerUpCapture={undefined}            />
          </View>
          <View style={styles.socialIcon}>
            <IconButton
              size={30}
              iconColor="green"
              icon="phone"
              onPress={() => Linking.openURL(`tel:${userMember.member?.telefoonnummer}`)} onPointerEnter={undefined} onPointerEnterCapture={undefined} onPointerLeave={undefined} onPointerLeaveCapture={undefined} onPointerMove={undefined} onPointerMoveCapture={undefined} onPointerCancel={undefined} onPointerCancelCapture={undefined} onPointerDown={undefined} onPointerDownCapture={undefined} onPointerUp={undefined} onPointerUpCapture={undefined}            />
          </View>
        </View>
      </View>
    );
  };
  const Counts = ({ count, title }: { count: string | number; title: string }) => {
    return (
      <View>
        <Animated.Text style={[styles.tabLabelText, { color: "black" }]}>{count}</Animated.Text>
        <Animated.Text style={[styles.tabLabelNumber, { color: "black" }]}>{title}</Animated.Text>
      </View>
    );
  };
  return (
    <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getUserMember} />}>
      <View style={[styles.container]}>
        <View style={styles.cardContainer}>
          <RenderContactHeader />
          <View style={styles.socialRow}>
            <Counts count={userMember.user?.spam_count} title={"Spam Count"} />
            <View style={{ width: 10 }} />
            <Counts count={userMember.user?.frust_count} title={"Frust Count"} />
            <View style={{ width: 10 }} />
            <Counts count={userMember.user?.zuur.toPrecision(3)} title={"Zuur"} />
          </View>
          <View style={{ marginTop: 30 }}>
            <List.AccordionGroup>
              {/* left={()} */}
              {userMember.member?.ploeglidmaatschappen?.length > 0 && (
                <List.Accordion title="Ploegjes" id={1}>
                  <List.AccordionGroup>
                    {userMember.member?.ploeglidmaatschappen.map((ploeg, i) => (
                      <List.Accordion
                        key={"pleog: " + i}
                        title={`${
                          ploeg.functie === "C"
                            ? "Coach"
                            : ploeg.functie === "R"
                            ? "Roeier"
                            : ploeg.functie === "S"
                            ? "Stuur"
                            : ploeg.functie
                        } in ${ploeg.ploeg.naam}`}
                        id={ploeg.ploeg.id}
                        left={(props) => <View style={{ width: 30 }} />}
                      >
                        {/* @ts-ignore */}
                        <List.Item title={`Geslacht: ${ploeg.ploeg.geslacht}`} />
                        {/* @ts-ignore */}
                        <List.Item title={`Sectie: ${ploeg.ploeg.sectie}`} />
                        {/* @ts-ignore */}
                        <List.Item title={`Niveau: ${ploeg.ploeg.niveau}`} />
                        {/* @ts-ignore */}
                        <List.Item title={`Seizoen: ${ploeg.ploeg.seizoen}`} />
                        {/* @ts-ignore */}
                        {ploeg.ploeg.verhaal && <List.Item title={`Verhaal: ${ploeg.ploeg.verhaal}`} />}
                        {/* for react native paper == v5 */}
                        {/* {ploeg.ploeg.foto && (
                    <List.Image source={{ uri: ploeg.ploeg.foto }} />
                  )} */}
                      </List.Accordion>
                    ))}
                  </List.AccordionGroup>
                </List.Accordion>
              )}
              {userMember.member?.commissielidmaatschappen?.length > 0 && (
                <List.Accordion title="Commissies" id={2}>
                  <List.AccordionGroup>
                    {userMember.member?.commissielidmaatschappen.map((commissie, i) => (
                      <List.Accordion
                        title={`${commissie.functie} in ${commissie.commissie.afkorting}`}
                        id={`${commissie.commissie.id} ${i}`}
                        key={"commisie" + i}
                        left={(props) => <View style={{ width: 30 }} />}
                      >
                        {/* @ts-ignore */}
                        <List.Item
                          // {dayjs(item.pub_date).format("D-M-YYYY | hh:mmA")}
                          title={`${commissie.commissie.naam}`}
                        />
                        {/* @ts-ignore */}
                        <List.Item
                          // {dayjs(item.pub_date).format("D-M-YYYY | hh:mmA")}
                          title={`Van ${dayjs(commissie.begindatum).format("MMM YYYY")} ${
                            commissie.einddatum ? "tot " + dayjs(commissie.einddatum).format("MMM YYYY") : ""
                          }`}
                        />
                      </List.Accordion>
                    ))}
                  </List.AccordionGroup>
                </List.Accordion>
              )}
              {/* Bestuurschappen */}
              {userMember.member?.bestuurslidmaatschappen?.length > 0 && (
                <>
                  {userMember.member?.bestuurslidmaatschappen?.map((bestuur, i) => (
                    <List.Accordion title={`${bestuur.bestuur.naam} Bestuur`} id={`${bestuur.bestuur.id} ${i}`} key={i}>
                      {/* @ts-ignore */}
                      <List.Item
                        // {dayjs(item.pub_date).format("D-M-YYYY | hh:mmA")}
                        title={`${bestuur.functie}`}
                      />
                      {/* @ts-ignore */}
                      <List.Item
                        title={`Vanaf ${dayjs(bestuur.bestuur.installatiedatum).format("MMMM YYYY")} ${
                          bestuur.bestuur.dechargedatum
                            ? "tot " + dayjs(bestuur.bestuur.dechargedatum).format("MMMM YYYY")
                            : ""
                        }`}
                      />
                    </List.Accordion>
                  ))}
                </>
              )}
            </List.AccordionGroup>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 10,
    marginTop: 45,
  },
  indicatorTab: {
    backgroundColor: "transparent",
  },
  scroll: {
    backgroundColor: "#FFF",
  },
  sceneContainer: {
    marginTop: 10,
  },
  socialIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    backgroundColor: "#EEE",
  },
  tabContainer: {
    flex: 1,
    marginBottom: 12,
  },
  tabLabelNumber: {
    color: "gray",
    fontSize: 12.5,
    textAlign: "center",
  },
  tabLabelText: {
    color: "black",
    fontSize: 22.5,
    fontWeight: "600",
    textAlign: "center",
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: "gray",
    fontSize: 13.5,
    textAlign: "center",
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
    backgroundColor: "none",
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: "#5B5A5A",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 12,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
