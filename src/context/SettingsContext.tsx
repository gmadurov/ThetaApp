import React, { createContext, useContext, useState } from "react";

import ApiContext from "./ApiContext";

/** provides Settings */
interface SettingsContextType {
  defaultHapQuantity: number;
  setDefaultHapQuantity: React.Dispatch<React.SetStateAction<number>>;
  defaultHapComment: string;
  setDefaultHapComment: React.Dispatch<React.SetStateAction<string>>;
  defaultActivityComment: string;
  setDefaultActivityComment: React.Dispatch<React.SetStateAction<string>>;
}
const SettingsContext = createContext({} as SettingsContextType);
export default SettingsContext;

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [defaultHapComment, setDefaultHapComment] = useState("");
  const [defaultHapQuantity, setDefaultHapQuantity] = useState(1);
  const [defaultActivityComment, setDefaultActivityComment] = useState("");
  const data = {
    defaultHapQuantity,
    setDefaultHapQuantity,
    defaultHapComment,
    setDefaultHapComment,
    defaultActivityComment,
    setDefaultActivityComment,
  };
  return <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>;
};
