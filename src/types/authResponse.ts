import type { UserRole } from "./userRole";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  name: string;
};