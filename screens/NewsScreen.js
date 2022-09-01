import { View, Text } from "react-native";
import { useContext, useEffect, useState } from "react";
import ApiContext from "../context/ApiContext";

const NewsScreen = () => {
  const { ApiRequest } = useContext(ApiContext);
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [news, setNews] = useState([]);
  useEffect(() => {
    async function get() {
      const { data } = await ApiRequest(
        `/news/?page=${page}&page_size=${pageSize}`
      );
      //   then((data) => {
        // console.log(data);
      setNews(() => data);
      //   });
    }
    get();
    return () => {
      setNews([]);
    };
  }, []);

  return (
    <View>
      <Text>NewsScreen</Text>
    </View>
  );
};

export default NewsScreen;
