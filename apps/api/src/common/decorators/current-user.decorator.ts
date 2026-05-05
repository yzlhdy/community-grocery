import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedRequest, AuthUser } from "../types/authenticated-request";

/**
 * 从当前请求中读取已认证的 JWT 用户信息。
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new Error("当前用户装饰器必须在已认证的请求中使用");
    }
    return request.user;
  },
);
