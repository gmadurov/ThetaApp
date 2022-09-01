import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ApiContext from "../context/ApiContext";

export default function MembersScreen() {
  const { ApiRequest } = useContext(ApiContext);
  const pageSize = 10;
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function get() {
      const { data } = await ApiRequest(
        `/members/${search && "?searchstring=" + search}`
      );
      console.log(data);
      setMembers(() => data);
    }
    get();
    return () => {
      setMembers([]);
    };
  }, []);

  return (
    <View>
      <Text>MembersScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
