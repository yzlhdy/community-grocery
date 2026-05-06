import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

export interface WriteAdminOperationLogInput {
  adminUserId?: string;
  module: string;
  action: string;
  resourceId?: string;
  summary: string;
  beforeData?: unknown;
  afterData?: unknown;
  ip?: string;
  userAgent?: string;
}

/**
 * 后台操作审计日志服务。
 */
@Injectable()
export class AdminOperationLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 记录后台管理员的关键业务操作。
   */
  write(input: WriteAdminOperationLogInput) {
    return this.prisma.adminOperationLog.create({
      data: {
        adminUserId: input.adminUserId,
        module: input.module,
        action: input.action,
        resourceId: input.resourceId,
        summary: input.summary,
        beforeData: this.toJson(input.beforeData),
        afterData: this.toJson(input.afterData),
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });
  }

  /**
   * 将可能包含 Decimal/Date 的对象安全转换为 JSON。
   */
  private toJson(value: unknown) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }
}
