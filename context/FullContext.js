import { createContext } from "react";
import { AuthProvider } from "./AuthContext";
import { ApiProvider } from "./ApiContext";
import { LedenProvider } from "./LedenContext";

const FullContext = createContext();
export default FullContext;
export const FullProvider = ({ children }) => {
  const data = {};
  return (
    <FullContext.Provider value={data}>
      <AuthProvider>
        <ApiProvider>
          <LedenProvider>{children}</LedenProvider>
        </ApiProvider>
        {/* ApiRequest: ApiRequest,
            ApiFileRequest: ApiFileRequest, */}
      </AuthProvider>
      {/* loginFunc: loginFunc,
          logoutFunc: logOutUser,
          setAuthTokens: setAuthTokens,
          setUser: setUser,
          user: user,
          authTokens: authTokens, */}
    </FullContext.Provider>
  );
};
