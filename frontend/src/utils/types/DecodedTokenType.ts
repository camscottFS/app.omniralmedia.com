import { JwtPayload } from "jwt-decode";

export interface DecodedTokenType extends JwtPayload {
  user: {
    id: number;
    username: string;
    email: string;
    roleId: number;
  };
}