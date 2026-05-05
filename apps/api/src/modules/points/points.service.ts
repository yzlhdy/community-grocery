import { Injectable } from "@nestjs/common";
import { PointsChangeType, Prisma } from "../../generated/prisma/client";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";

/**
 * 提供积分增减和流水查询能力。
 */
@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询用户积分流水。
   */
  async findMine(customerId: string, query: PageQueryDto) {
    const pagination = resolvePagination(query);
    const where = { customerId };
    const [list, total] = await Promise.all([
      this.prisma.pointsLedger.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.pointsLedger.count({ where }),
    ]);

    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 给用户增加积分。
   */
  async addPoints(
    tx: Prisma.TransactionClient,
    input: { customerId: string; points: number; description: string; orderId?: string },
  ) {
    const customer = await tx.customer.update({
      where: { id: input.customerId },
      data: { points: { increment: input.points } },
    });

    return tx.pointsLedger.create({
      data: {
        customerId: input.customerId,
        type: PointsChangeType.ORDER_REWARD,
        points: input.points,
        balance: customer.points,
        description: input.description,
        orderId: input.orderId,
      },
    });
  }

  /**
   * 扣减用户积分。
   */
  async deductPoints(
    tx: Prisma.TransactionClient,
    input: { customerId: string; points: number; description: string; orderId?: string },
  ) {
    const customer = await tx.customer.update({
      where: { id: input.customerId },
      data: { points: { decrement: input.points } },
    });

    return tx.pointsLedger.create({
      data: {
        customerId: input.customerId,
        type: PointsChangeType.REFUND_DEDUCT,
        points: -input.points,
        balance: customer.points,
        description: input.description,
        orderId: input.orderId,
      },
    });
  }
}
