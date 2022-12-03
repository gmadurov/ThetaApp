import AuthContext, { FailedRequest } from "./AuthContext";
import { AuthToken, AuthToken_decoded } from "../models/AuthToken";
import React, { createContext, useContext } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/Users";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";
import { showMessage } from "react-native-flash-message";

// ("https://stropdas2.herokuapp.com/");
/**### use this instead of fetch
 * user: user, type
 * {"token_type": string,"exp": unix date,"iat": unix date,"jti": string,"user_id": Int,"name": string,"roles": [ ],"user_id": Int}
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

// recreate file in typscript

export type ApiContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  ApiRequest<TResponse>(
    url: string,
    config?: {
      headers?: { [key: string]: any; "Content-Type": string };
      [key: string]: any;
    }
  ): Promise<{ res: Response; data: TResponse }>;
  refreshToken: (authTokens: AuthToken) => Promise<AuthToken>;
  baseUrl: string;
  setAuthTokens: React.Dispatch<React.SetStateAction<AuthToken>>
  setAuthTokensDecoded: React.Dispatch<React.SetStateAction<AuthToken_decoded>>
};

const ApiContext = createContext<ApiContextType>({} as ApiContextType);

export default ApiContext;

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  // will work from AuthProvider downwards,
  const {
    user,
    setAuthTokens,
    setUser,
    authTokens,
    logoutFunc,
    authTokensDecoded,
    setAuthTokensDecoded,
    originalRequest,
    baseUrl,
  } = useContext(AuthContext);

  async function returnAccessToken() {
    let tokens = JSON.parse((await AsyncStorage.getItem("authTokens")) as string) as AuthToken;
    if (!tokens) return;
    return tokens?.access_token;
  }

  /** gets the refresh token and update the local state and local storage */
  async function refreshToken(authToken?: AuthToken): Promise<AuthToken> {
    if (authToken === undefined) {
      authToken = (await JSON.parse((await AsyncStorage.getItem("authTokens")) as string)) as AuthToken;
    }
    const { res, data } = await originalRequest<FailedRequest>(`/login/refresh/`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: authToken?.refresh_token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      const user = await ApiRequest<User>("/users/me/", {
        headers: {
          Accept: "*/*",
          Authorization: data.access_token,
          "Content-Type": "application/json",
        },
      });
      let tokens = {
        refresh_token: authToken?.refresh_token,
        user: user.data,
        access_token: data?.access_token,
      };

      setAuthTokens(() => tokens); // if cycling refresh tokens
      setAuthTokensDecoded(() => ({
        refresh_token: jwtDecode(authToken?.refresh_token as string),
        user: user.data,
        access_token: jwtDecode(data.access_token as string),
      })); // if cycling refresh tokens
      setUser(user.data);
      // await AsyncStorage.setItem(
      //   "authTokens",
      //   JSON.stringify({
      //     refresh_token: authToken.refresh_token,
      //     user: user.data,
      //     access_token: data.access_token,
      //   } as AuthToken)
      // ); // if cycling refresh tokens
      return data as AuthToken;
    } else {
      // console.log(`Problem met de refresh token: ${res?.status}`);
      showMessage({
        message: "Refresh token expired",
        description: "Je hebt de app in te lang niet gebruikt, je woord uitgelogged",
        type: "info",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
      console.log("refresh token expired");
      await logoutFunc();
      return {} as AuthToken;
    }
    // cancels the request if it taking too long
  }

  async function checkTokens() {
    if (!authTokensDecoded?.access_token) {
      return await refreshToken();
    }
    const isExpired = user ? dayjs.unix(authTokensDecoded.refresh_token.exp).diff(dayjs(), "minute") < 1 : false;
    const isExpiredRefresh = authTokens ? dayjs.unix(authTokensDecoded.refresh_token.exp).diff(dayjs(), "minute") < 1 : true;
    if (isExpiredRefresh) {
      // Alert.alert("refresh token has expired, you were logged out");
      await logoutFunc();
      showMessage({
        message: "Refresh token has expired, you were logged out",
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
    }
    if (isExpired && authTokens) {
      return await refreshToken();
    }
    return authTokens;
  }
  /** ## use this instead of fetch
   * @params {url: string , config : object}
   * @returns \{ res, data \}*/
  async function ApiRequest<TResponse>(
    url: string,
    config: {
      headers?: { [key: string]: any; "Content-Type": string };
      [key: string]: any;
    } = {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ) {
    if (!config.headers?.["Content-Type"]) {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }
    if (["", undefined].includes(config.headers.Authorization)) {
      config.headers = {
        ...config.headers,
        Authorization: await returnAccessToken(),
      };
    }
    if (!config.headers.Authorization) {
      return { res: {} as Response, data: {} as TResponse };
    }

    const { res, data } = await originalRequest<TResponse>(url, config);
    return { res: res, data: data };
  }

  const value_dic = {
    user: user,
    setUser: setUser,
    ApiRequest: ApiRequest,
    refreshToken: refreshToken,
    baseUrl,
    setAuthTokens,
    setAuthTokensDecoded,
  };
  return <ApiContext.Provider value={value_dic}>{children}</ApiContext.Provider>;
};
