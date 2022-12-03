import React, { createContext, useContext } from "react";

import ApiContext from "./ApiContext";

/** provides Settings */
interface SettingsContextType {}
const SettingsContext = createContext({} as SettingsContextType);
export default SettingsContext;

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, ApiRequest } = useContext(ApiContext);

  const data = {};
  return <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>;
};
