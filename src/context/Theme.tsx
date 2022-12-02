import { MD3LightTheme as DefaultTheme, useTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    thetaBrown: "#573315",
    primary: "#FFDD00",
    theta: "rgb(255, 221, 0)",
    onPrimary: "rgba(255, 221, 0,1)",
    thetaColors: {
      primary1: "#FFDD00", // backgorund
      primary2: "#92B4A7",
      primary3: "#364652",
      primary4: "#F2542D",
      primary5: "#1E2EDE",
      offwhite: "#FAFAFA",
      white: "#FFFFFF",

      accent500: "#f7bc0c",
      errorMessage: "#FE5F55",
      infoMessage: "#403F4C",
      primaryMessage: "#F9DC5C",
      secondaryMessage: "#3185FC",
      successMessage: "#48A9A6",

      androidRippleColor: "#ccc",
      shadowColor: "black",
      textColorLight: "white",
      textColorDark: "black",
      iconColor: "grey",
      thetaBrown: "#573315",
      thetaGeel: "#FFDD00",
    },
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
// primary colors
// https://coolors.co/ffdd00-92b4a7-364652-f2542d-1e2ede

// message colors
// https://coolors.co/fe5f55-403f4c-f9dc5c-3185fc-48a9a6
