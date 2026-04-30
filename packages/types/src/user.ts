export type UserRole = "customer" | "operator" | "admin";

export interface User {
  id: string;
  nickname: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
}
