import type { Request } from "express";

export type AuthRole = "admin" | "customer";

/**
 * JWT payload attached to authenticated requests.
 */
export interface AuthUser {
  sub: string;
  role: AuthRole;
  username?: string;
  openId?: string;
}

/**
 * Express request extended with the authenticated user payload.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
