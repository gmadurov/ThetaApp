import AuthContext, { FailedRequest, baseUrl } from "./AuthContext";
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
  ApiFileRequest<TResponse>(
    url: string,
    config?: {
      headers?: { [key: string]: any; "Content-Type": string };
      [key: string]: any;
    }
  ): Promise<{ res: Response; data: TResponse }>;
  refreshToken: (authTokens: AuthToken) => Promise<AuthToken>;
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
  } = useContext(AuthContext);

  async function returnAccessToken() {
    // if (authTokens) {
    //   return authTokens?.access_token;
    // }
    let tokens = (await JSON.parse(
      (await AsyncStorage.getItem("authTokens")) as string
    )) as AuthToken;
    
    return tokens?.access_token;
  }

  /** makes the original request called but with the Bearer set and to the correct location */
  async function originalRequest<TResponse>(
    url: string,
    config: object
  ): Promise<{ res: Response; data: TResponse }> {
    let urlFetch = `${baseUrl()}${url}`;
    // console.log(urlFetch, config);
    const res = await fetch(urlFetch, config);
    const data = await res.json();
    // console.log("originalRequest", data, res?.status);
    if (res?.status === 401) {
      await logoutFunc();
    } else if (res?.status !== 200) {
      // Alert.alert(`Error ${res?.status} fetching ${url}`);
      showMessage({
        message: `Error ${res?.status}`,
        description: `fetching ${url}`,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
    }

    return { res, data } as { res: Response; data: TResponse };
  }

  /** gets the refresh token and update the local state and local storage */
  async function refreshToken(authToken?: AuthToken): Promise<AuthToken> {
    if (authToken === undefined) {
      authToken = (await JSON.parse(
        (await AsyncStorage.getItem("authTokens")) as string
      )) as AuthToken;
    }

    const { res, data } = await originalRequest<FailedRequest>(
      `/login/refresh/`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: authToken?.refresh_token,
          "Content-Type": "application/json",
        },
      }
    );

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
      await AsyncStorage.setItem(
        "authTokens",
        JSON.stringify({
          refresh_token: authToken.refresh_token,
          user: user.data,
          access_token: data.access_token,
        } as AuthToken)
      ); // if cycling refresh tokens
      return data as AuthToken;
    } else {
      // console.log(`Problem met de refresh token: ${res?.status}`);
      showMessage({
        message: "Refresh token expired",
        description:
          "Je hebt de app in te lang niet gebruikt, je woord uitgelogged",
        type: "info",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 1500,
      });
      await logoutFunc();
      return {} as AuthToken;
    }
    // cancels the request if it taking too long
  }

  async function checkTokens() {
    if (!authTokensDecoded?.access_token) {
      return await refreshToken();
    }
    const isExpired = user
      ? dayjs
          .unix(authTokensDecoded.refresh_token.exp)
          .diff(dayjs(), "minute") < 1
      : false;
    const isExpiredRefresh = authTokens
      ? dayjs
          .unix(authTokensDecoded.refresh_token.exp)
          .diff(dayjs(), "minute") < 1
      : true;
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

    if (user) {
      const { res, data } = await originalRequest<TResponse>(url, config);
      // if (res?.status === 200) {
      // console.warn("request Failed", res?.status);
      return { res: res, data: data };
      // }
    }
    return { res: {} as Response, data: {} as TResponse };
  }
  // /** ## ust this instead of fetch for Files
  //  * @params {url: string , config : object}
  //  * @returns \{ res, data \}*/
  async function ApiFileRequest<TResponse>(
    url: string,
    config:
      | {
          headers?: { [key: string]: any; "Content-Type": "application/json" };

          [key: string]: any;
        }
      | undefined = {
      headers: {
        Authorization: authTokens?.access_token,
        "Content-Type": "application/json",
      },
    }
  ): Promise<{ res: Response; data: TResponse }> {
    await checkTokens();
    if (user) {
      const { res, data } = await originalRequest<TResponse>(url, config);
      if (res?.status === 401) {
        // Alert.alert("", url, config);
        showMessage({
          message: `Unauthorized`,
          description: ``,
          type: "danger",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
      }
      if (res?.status === 403) {
        // Alert.alert("", url, config);
        showMessage({
          message: `Permision denied`,
          description: ``,
          type: "danger",
          floating: true,
          hideStatusBar: true,
          autoHide: true,
          duration: 1500,
        });
      }
      return { res, data };
    }
    return { res: {} as Response, data: {} as TResponse };

    // console.log("input", url);
  }

  const value_dic = {
    user: user,
    setUser: setUser,
    ApiRequest: ApiRequest,
    ApiFileRequest: ApiFileRequest,
    refreshToken: refreshToken,
  };
  return (
    <ApiContext.Provider value={value_dic}>{children}</ApiContext.Provider>
  );
};
