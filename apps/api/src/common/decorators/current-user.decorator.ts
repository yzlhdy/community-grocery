import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedRequest, AuthUser } from "../types/authenticated-request";

/**
 * Reads the authenticated JWT payload from the current request.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new Error("CurrentUser used without an authenticated request");
    }
    return request.user;
  },
);
