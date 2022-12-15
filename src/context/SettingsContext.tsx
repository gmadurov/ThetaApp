import React, { createContext, useContext, useState } from "react";

/** provides Settings */
interface SettingsContextType {
  defaultHapQuantity: number;
  setDefaultHapQuantity: React.Dispatch<React.SetStateAction<number>>;
  defaultHapComment: string;
  setDefaultHapComment: React.Dispatch<React.SetStateAction<string>>;
  defaultActivityComment: string;
  setDefaultActivityComment: React.Dispatch<React.SetStateAction<string>>;
  selectedNotification: NotificationEnum;
  setNotification: React.Dispatch<React.SetStateAction<NotificationEnum>>;
}
const SettingsContext = createContext({} as SettingsContextType);
export default SettingsContext;

export enum NotificationEnum {
  Voo = "Voo.wav",
  Jaar_Oud = "40_jaar_oud.wav",
  Klein_geil_klootje = "klein_geil_klootje.wav",
  Sexy_als_ik_rooie = "Sexy_als_ik_rooie.wav",
}
export type NotificationTypeEnum = keyof typeof NotificationEnum;

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [defaultHapComment, setDefaultHapComment] = useState("");
  const [defaultHapQuantity, setDefaultHapQuantity] = useState(1);
  const [defaultActivityComment, setDefaultActivityComment] = useState("");
  const [selectedNotification, setNotification] = useState<NotificationEnum>(NotificationEnum.Voo);

  const data = {
    defaultHapQuantity,
    setDefaultHapQuantity,
    defaultHapComment,
    setDefaultHapComment,
    defaultActivityComment,
    setDefaultActivityComment,
    selectedNotification,
    setNotification,
  };
  return <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>;
};
