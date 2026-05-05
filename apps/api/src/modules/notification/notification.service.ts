import { Injectable } from "@nestjs/common";
import { NotificationType, Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";

/**
 * 站内通知服务，后续可扩展为微信订阅消息和短信。
 */
@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建一条用户通知。
   */
  create(input: {
    customerId: string;
    type: NotificationType;
    title: string;
    content: string;
    payload?: Prisma.InputJsonValue;
  }) {
    return this.prisma.notification.create({ data: input });
  }

  /**
   * 查询用户通知列表。
   */
  async findMine(customerId: string, query: PageQueryDto = {}) {
    const pagination = resolvePagination(query);
    const where = { customerId };
    const [list, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.notification.count({ where }),
    ]);
    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 统计用户未读通知数量。
   */
  countUnread(customerId: string) {
    return this.prisma.notification.count({
      where: { customerId, readAt: null },
    });
  }

  /**
   * 将一条通知标记为已读。
   */
  markRead(customerId: string, id: string) {
    return this.prisma.notification.update({
      where: { id, customerId },
      data: { readAt: new Date() },
    });
  }

  /**
   * 将当前用户全部通知标记为已读。
   */
  async markAllRead(customerId: string) {
    await this.prisma.notification.updateMany({
      where: { customerId, readAt: null },
      data: { readAt: new Date() },
    });
    return { success: true };
  }
}
