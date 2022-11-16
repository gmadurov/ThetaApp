import { AuthToken, AuthToken_decoded } from "../models/AuthToken";
import React, { createContext, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/Users";
import jwtDecode from "jwt-decode";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

//  "https://stropdas.herokuapp.com";
//  "http://127.0.0.1:8000";
export const baseUrl = () => {
  let url: string;
  // console.log("process.env.NODE_ENV", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    url = "https://web35.esrtheta.nl/v2";
    // url = "http://10.0.2.2:8000";
  } else if (process.env.NODE_ENV === "production") {
    url = "https://api.esrtheta.nl/v2";
  } else {
    url = "http://10.0.2.2:8000";
  }
  return url;
};

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
  loginFunc: (
    username: string,
    password: string,
    setIsAuthenticating: any
  ) => Promise<void>;
  logoutFunc(user?: User): Promise<void>;
};
const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // dont use useFetch here because it will not work
  const [authTokensDecoded, setAuthTokensDecoded] = useState<AuthToken_decoded>(
    {} as AuthToken_decoded
  );
  const [authTokens, setAuthTokens] = useState<AuthToken>({} as AuthToken);
  const [user, setUser] = useState<User>({} as User);
  /**this function is simply to wake up the backend when working with heroku */

  async function loginFunc(
    username: string,
    password: string,
    setIsAuthenticating: any
  ) {
    let res: Response = await fetch(`${baseUrl()}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    let data: FailedRequest = await res.json();
    // console.log(res);

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
  const data = {
    loginFunc,
    logoutFunc,
    setAuthTokensDecoded,
    setUser,
    user,
    authTokensDecoded,
    authTokens,
    setAuthTokens,
  };
  // user && navigate("../login", { replace: true });
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
