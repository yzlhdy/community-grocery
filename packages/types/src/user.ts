export type UserRole = "customer" | "operator" | "admin";

export interface User {
  id: string;
  nickname: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "OPERATOR";
}

export interface Customer {
  id: string;
  openId: string;
  unionId?: string;
  nickname?: string;
  avatarUrl?: string;
  phone?: string;
}
