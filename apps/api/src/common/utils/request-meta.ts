import type { Request } from "express";

/**
 * 从请求中提取后台审计需要的客户端元信息。
 */
export function getRequestMeta(request: Request) {
  return {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  };
}
