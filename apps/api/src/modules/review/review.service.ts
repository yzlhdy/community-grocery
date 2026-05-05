import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";
import { OrderStatus } from "../../generated/prisma/client";
import { PointsService } from "../points/points.service";
import { CreateReviewDto } from "./dto/create-review.dto";

/**
 * 提供商品评价创建和查询能力。
 */
@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointsService: PointsService,
  ) {}

  /**
   * 查询商品评价列表。
   */
  async findByProduct(productId: string, query: PageQueryDto) {
    const pagination = resolvePagination(query);
    const where = { productId };
    const [list, total] = await Promise.all([
      this.prisma.productReview.findMany({
        where,
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.productReview.count({ where }),
    ]);

    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 查询我的评价。
   */
  async findMine(customerId: string, query: PageQueryDto) {
    const pagination = resolvePagination(query);
    const where = { customerId };
    const [list, total] = await Promise.all([
      this.prisma.productReview.findMany({
        where,
        include: { product: true, orderItem: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.productReview.count({ where }),
    ]);

    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 创建商品评价，并给用户发放评价积分。
   */
  async create(customerId: string, dto: CreateReviewDto) {
    return this.prisma.$transaction(async (tx) => {
      const orderItem = await tx.orderItem.findUnique({
        where: { id: dto.orderItemId },
        include: { order: true, sku: true },
      });
      if (!orderItem || orderItem.order.customerId !== customerId) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "订单商品不存在", HttpStatus.NOT_FOUND);
      }
      if (orderItem.order.status !== OrderStatus.COMPLETED) {
        throw new BusinessException(ErrorCode.INVALID_ORDER_STATUS, "只有已完成订单可以评价");
      }

      const review = await tx.productReview.create({
        data: {
          customerId,
          orderId: orderItem.orderId,
          orderItemId: orderItem.id,
          productId: orderItem.sku.productId,
          skuId: orderItem.skuId,
          rating: dto.rating,
          content: dto.content,
          imageUrls: dto.imageUrls ?? [],
          anonymous: dto.anonymous ?? false,
        },
      });

      await this.pointsService.addPoints(tx, {
        customerId,
        points: 5,
        description: "评价商品奖励积分",
        orderId: orderItem.orderId,
      });

      return review;
    });
  }
}
