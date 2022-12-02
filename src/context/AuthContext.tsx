import { AuthToken, AuthToken_decoded } from "../models/AuthToken";
import React, { createContext, useEffect, useLayoutEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/Users";
import jwtDecode from "jwt-decode";
import { showMessage } from "react-native-flash-message";

export interface FailedRequest extends AuthToken {
  non_field_errors?: string[];
}

export type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  authTokens: AuthToken;
  setAuthTokens: React.Dispatch<React.SetStateAction<AuthToken>>;
  authTokensDecoded: AuthToken_decoded;
  setAuthTokensDecoded: React.Dispatch<React.SetStateAction<AuthToken_decoded>>;
  loginFunc: (username: string, password: string, setIsAuthenticating: any) => Promise<void>;
  logoutFunc(user?: User): Promise<void>;
  baseUrl: string;
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
  originalRequest<TResponse>(
    url: string,
    config: object
  ): Promise<{
    res: Response;
    data: TResponse;
  }>;
};
const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // dont use useFetch here because it will not work
  const [authTokensDecoded, setAuthTokensDecoded] = useState<AuthToken_decoded>({} as AuthToken_decoded);
  const [authTokens, setAuthTokens] = useState<AuthToken>({} as AuthToken);
  const [user, setUser] = useState<User>({} as User);
  /**this function is simply to wake up the backend when working with heroku */
  const [baseUrl, setBaseUrl] = useState<string>("");
  // console.log("baseUrl", baseUrl);

  useLayoutEffect(() => {
    async () => {
      let url = await AsyncStorage.getItem("baseUrl");
      setBaseUrl(url || "");
    };
    return () => {};
  }, []);

  useEffect(() => {
    async function wakeUp() {
      if (baseUrl === "") {
        if (process.env.NODE_ENV === "development") {
          setBaseUrl("https://web35.esrtheta.nl/v2");
        } else if (process.env.NODE_ENV === "production") {
          setBaseUrl("https://api.esrtheta.nl/v2");
        }
      }
      await AsyncStorage.setItem("baseUrl", baseUrl);
      await logoutFunc();
    }
    wakeUp();
  }, [baseUrl]);

  useLayoutEffect(() => {
    async function save() {
      if (authTokens?.access_token) {
        await AsyncStorage.setItem("authTokens", authTokens.access_token ? JSON.stringify(authTokens) : "");
      } else {
        let data = await AsyncStorage.getItem("authTokens");
        // check if the user.exp is expired
        let locUser = data ? (JSON.parse(data) as AuthToken) : null;
        console.log("locUser", locUser);
        if (locUser?.access_token) {
          setAuthTokens(locUser);
          setAuthTokensDecoded(jwtDecode(locUser.access_token));
        } else {
          await AsyncStorage.removeItem("authTokens");
        }
      }
    }
    save();
  }, [authTokens]);

  async function loginFunc(username: string, password: string, setIsAuthenticating: any) {
    let { res, data } = await originalRequest<FailedRequest>(`/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (res?.status === 200) {
      setUser(data?.user as User);
      setAuthTokens(data);
      setAuthTokensDecoded({
        user: data.user,
        access_token: jwtDecode(data.access_token),
        refresh_token: jwtDecode(data.refresh_token),
      });
      await AsyncStorage.setItem("authTokens", JSON.stringify(data));

      // navigation.replace("ProductsPage");
    } else {
      showMessage({
        message: "Account info klopt niet",
        description: data.non_field_errors ? data?.non_field_errors[0] : "",
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 3500,
      });
      // navigation.navigate({"Producten"});
    }
    setIsAuthenticating(false);
  }

  async function logoutFunc() {
    await AsyncStorage.removeItem("authTokens");
    setUser(() => ({} as User));
    setAuthTokens(() => ({} as AuthToken));
    setAuthTokensDecoded(() => ({} as AuthToken_decoded));
  }

  async function originalRequest<TResponse>(url: string, config: object): Promise<{ res: Response; data: TResponse }> {
    let urlFetch;
    if (!["", null].includes(baseUrl)) {
      urlFetch = `${baseUrl}${url}`;
      // console.log("urlFetch 162", );
    } else {
      urlFetch = `${await AsyncStorage.getItem("baseUrl")}${url}`;
    }
    const res = await fetch(urlFetch, config);
    const data = await res.json();
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

  const data = {
    loginFunc,
    logoutFunc,
    setAuthTokensDecoded,
    setUser,
    user,
    authTokensDecoded,
    authTokens,
    setAuthTokens,
    baseUrl,
    setBaseUrl,
    originalRequest,
  };
  // user && navigate("../login", { replace: true });
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
