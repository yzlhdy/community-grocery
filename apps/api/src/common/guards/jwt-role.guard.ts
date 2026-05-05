import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  mixin,
  Type,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type {
  AuthenticatedRequest,
  AuthRole,
  AuthUser,
} from "../types/authenticated-request";

/**
 * 为后台管理员或小程序用户路由创建带角色限制的 JWT 守卫。
 */
export function JwtRoleGuard(...roles: AuthRole[]): Type<CanActivate> {
  @Injectable()
  /**
   * 由 `JwtRoleGuard` 动态生成的运行时守卫。
   */
  class RoleGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * 校验 Bearer Token 并检查是否具备目标角色。
     */
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      const authorization = request.headers.authorization;
      const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;

      if (!token) {
        throw new UnauthorizedException("缺少 Bearer Token");
      }

      try {
        const payload = await this.jwtService.verifyAsync<AuthUser>(token);
        if (!roles.includes(payload.role)) {
          throw new UnauthorizedException("令牌角色不匹配");
        }
        request.user = payload;
        return true;
      } catch {
        throw new UnauthorizedException("无效的 Bearer Token");
      }
    }
  }

  return mixin(RoleGuard);
}
