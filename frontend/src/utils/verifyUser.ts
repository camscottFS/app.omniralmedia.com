import { jwtDecode, JwtPayload } from "jwt-decode";
import { DecodedTokenType } from './types/DecodedTokenType';
import { UserType } from './types/UserType';

export const verifyUser = (token: string | null): DecodedTokenType | null => {
  try {
    if (!token) throw new Error('No token provided');

    // Decode the token
    const decodedToken = jwtDecode<JwtPayload & { user: UserType }>(token);

    // Check if token is expired
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }

    return decodedToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Token verification failed:', error.message);
    } else {
      console.error('Token verification failed:', error);
    }
    return null;
  }
};
