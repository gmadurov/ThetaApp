import React, { createContext, useState } from "react";

import { ApiProvider } from "./ApiContext";
import { AuthProvider } from "./AuthContext";
import { NFCProvider } from "./NFCContext";
import { SettingsProvider } from "./SettingsContext";

// create type context

type FullContextType = {
  BottomSearch: boolean;
  setBottomSearch: React.Dispatch<React.SetStateAction<boolean>>;
  enableBottomSearch: boolean;
  setEnableBottomSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

/** provides Settings */
const FullContext = createContext<FullContextType>({} as FullContextType);
export default FullContext;
export const FullProvider = ({ children }: { children: React.ReactNode }) => {
  const [BottomSearch, setBottomSearch] = useState<boolean>(false);
  const [enableBottomSearch, setEnableBottomSearch] = useState<boolean>(false);
  const data = {
    BottomSearch,
    setBottomSearch,
    enableBottomSearch,
    setEnableBottomSearch,
  };
  return (
    <FullContext.Provider value={data}>
      <AuthProvider>
        <ApiProvider>
          <SettingsProvider>
            <NFCProvider>{children}</NFCProvider>
          </SettingsProvider>
        </ApiProvider>
      </AuthProvider>
    </FullContext.Provider>
  );
};
