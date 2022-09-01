import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { createContext, useContext } from "react";
import AuthContext, { baseUrl } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// ("https://stropdas2.herokuapp.com/");
/**### use this instead of fetch
 * user: user, type
 * {"token_type": string,"exp": unix date,"iat": unix date,"jti": string,"user_id": Int,"name": string,"roles": [ ],"lid_id": Int}
 *
 * ApiRequest: ApiRequest,
 * ### use this instead of fetch
 * @params {url: string , config : object}
 * @returns \{ res, data \}
 *
 * ApiFileRequest: ApiFileRequest,
 * ### use this instead of fetch for files
 * @params {url: string , config : object}
 * @returns \{ res, data \}
 *
 * refreshToken: refreshToken
 * use this to refresh tockens
 * */
const ApiContext = createContext({
  ApiRequest: async (url = "", config = {}) => {},
  ApiFileRequest: async (url = "", config = {}) => {},
  refreshToken: async (authTokens = {}) => {},
  user: {
    token_type: "",
    exp: "",
    iat: "",
    jti: "",
    user_id: 0,
    name: "",
    role: [],
    lid_id: 0,
  },
});
export default ApiContext;

export const ApiProvider = ({ children }) => {
  // will work from AuthProvider downwards,
  const { user, setAuthTokens, setUser, authTokens, logoutFunc } =
    useContext(AuthContext);
  /** makes the original request called but with the Bearer set and to the correct location */
  async function originalRequest(url, config) {
    let urlFetch = `${baseUrl()}${url}`;
    // console.log(urlFetch, config);

    const res = await fetch(urlFetch, config);
    const data = await res.json();
    if (res?.status !== 200) {
      Alert.alert(`Error ${res?.status} fetching ${url}`);
    }
    console.log([res, data]);
    return [res, data];
  }

  /** gets the refresh token and update the local state and local storage */
  async function refreshToken(authToken) {
    const config = {
      /*  */ method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: authToken?.refresh_token,
      },
    };
    const res = await fetch(`${baseUrl()}/login/refresh/`, config);
    let data = await res.json();
    if (res?.status === 200) {
      fetch(`${baseUrl()}/users/me/`, {
        headers: { Authorization: data.access_token },
      })
        .then((res) => res.json())
        .then((data) => setUser(() => data))
        .catch((err) => console.log(err));
      // await AsyncStorage.setItem("user", JSON.stringify(data.access_token));
    } else {
      console.log(`Problem met de refresh token: ${res?.status}`);
      // await logoutFunc();
    }
  }

  /** ## use this instead of fetch
   * @params {url: string , config : object}
   * @returns \{ res, data \}*/
  const ApiRequest = async (url, config = {}) => {
    const isExpiredRefresh =
      dayjs.unix(authTokens?.refresh_token?.exp).diff(dayjs(), "minute") < 1;
    const isExpired = dayjs.unix(user?.exp).diff(dayjs(), "minute") < 1;
    if (isExpiredRefresh) {
      Alert.alert("refresh token has expired, you were logged out");
      await logoutFunc();
    }
    if (isExpired && authTokens) {
      console.log("isExpired 1");
      await refreshToken(authTokens);
      console.log("isExpired 2");
    }
    config["headers"] = {
      Authorization: `Bearer ${authTokens?.access_token}`,
    };
    if (!config["headers"]["Content-type"]) {
      config["headers"]["Content-type"] = "application/json";
    }
    if (user) {
      const [res, data] = await originalRequest(url, config);
      if (res?.status !== 200) {
        console.warn("request Failed", res?.status);
      } else {
        // console.log("request successful");
        // console.log(data);
        return { res: res, data: data };
      }
    } else {
      // console.log("no user", url, config);
      return { res: { status: 503 }, data: [] };
    }
    // const [res, data] = await originalRequest(url, config);
    // return { res, data };
  };
  /** ## ust this instead of fetch for Files
   * @params {url: string , config : object}
   * @returns \{ res, data \}*/
  const ApiFileRequest = async (url, config = {}) => {
    const isExpired = dayjs.unix(user?.exp).diff(dayjs(), "minute") < 1;
    if (isExpired) {
      refreshToken(authTokens);
    }
    config["headers"] = {
      Authorization: `Authentication ${authTokens?.access_token}`,
    };
    if (user) {
      const [res, data] = await originalRequest(url, config);
      if (res?.status === 401) {
        Alert.alert("Unauthorized", url, config);
      }
      if (res?.status === 403) {
        Alert.alert("Permision denied", url, config);
      }
      return { res, data };
    }

    // console.log("input", url);
  };

  const value_dic = {
    user: user,
    ApiRequest: ApiRequest,
    ApiFileRequest: ApiFileRequest,
    refreshToken: refreshToken,
  };
  return (
    <ApiContext.Provider value={value_dic}>{children}</ApiContext.Provider>
  );
};
