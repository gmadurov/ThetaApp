import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { AuthenticatedRoutes } from "./Authenticated";
import { AuthRoutes } from "./UnAuthenticatedRoutes";

export function Navigation({ onLayout, isTryingLogin }: { onLayout: () => Promise<void>; isTryingLogin: boolean }) {
    const { user } = useContext(AuthContext);
  
    return <>{!user?.id ? <AuthRoutes /> : <AuthenticatedRoutes isTryingLogin={isTryingLogin} />}</>;
  }