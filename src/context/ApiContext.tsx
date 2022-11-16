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
  refreshToken: (authTokens: AuthToken) => Promise<boolean>;
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
  async function refreshToken(authToken: AuthToken): Promise<boolean> {
    const controller = new AbortController();
    const { signal } = controller;

    const res = await fetch(`${baseUrl()}/login/refresh/`, {
      signal,
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: authToken?.refresh_token,
        "Content-Type": "application/json",
      },
    });
    setTimeout(() => controller.abort(), 2000);
    let data: FailedRequest = await res.json();

    if (res?.status === 200) {
      const user = await ApiRequest<User>("/users/me/", {
        headers: {
          Accept: "*/*",
          Authorization: data.access_token,
          "Content-Type": "application/json",
        },
      });
      setAuthTokens({
        ...authTokens,
        user: user.data,
        access_token: data.access_token,
      }); // if cycling refresh tokens
      setAuthTokensDecoded({
        ...authTokensDecoded,
        user: user.data,
        access_token: jwtDecode(data.access_token as unknown as string),
      }); // if cycling refresh tokens
      setUser(user.data);
      await AsyncStorage.setItem(
        "authTokens",
        JSON.stringify({
          ...authTokens,
          access_token: data.access_token,
        })
      ); // if cycling refresh tokens
      return true;
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
      return false;
    }
    // cancels the request if it taking too long
  }

  async function checkTokens() {
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
      await refreshToken(authTokens);
    }
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
        Authorization: `Bearer ${authTokens?.access_token}`,
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
    if (config.headers?.Authorization === undefined) {
      await checkTokens();
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authTokens?.access_token}`,
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
        Authorization: `Bearer ${authTokens?.access_token}`,
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
