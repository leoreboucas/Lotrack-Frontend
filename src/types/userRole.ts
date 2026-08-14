export const UserRole = {
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
  VIEWER: "VIEWER"
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];