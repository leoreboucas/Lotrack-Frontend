import type { UserRole } from "./userRole";

export type JwtClaims = {
  sub: string;
  exp: number;
  role: UserRole;
};