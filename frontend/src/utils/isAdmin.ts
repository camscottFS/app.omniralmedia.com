import { UserType } from "./types/UserType";

export const isAdmin = (user: UserType) => {
  if (!user) return false;
  return user.roleId === 1;
}