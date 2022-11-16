import { User } from "./Users";

export interface AuthToken_decoded {
  user: User;
  refresh_token: TokenInfo;
  access_token: TokenInfo;
}
export interface AuthToken {
  user: User;
  refresh_token: string;
  access_token: string;
}

export default interface TokenInfo {
  fresh: boolean;
  iat: number;
  jti: string;
  type: string;
  sub: { id: number; token: string };
  nbf: number;
  exp: number;
  claims: string[];
}
