import type { Request } from "express";

export type AuthRole = "admin" | "customer";

/**
 * 附加到已认证请求上的 JWT 载荷。
 */
export interface AuthUser {
  sub: string;
  role: AuthRole;
  username?: string;
  openId?: string;
}

/**
 * 扩展了认证用户信息的 Express 请求。
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
