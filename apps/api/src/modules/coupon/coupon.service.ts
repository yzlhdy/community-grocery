import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";
import { CustomerCouponStatus } from "../../generated/prisma/client";
import { CouponQueryDto } from "./dto/coupon-query.dto";

/**
 * 提供小程序优惠券领取和查询能力。
 */
@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询用户优惠券。
   */
  async findMine(customerId: string, query: CouponQueryDto = {}) {
    const pagination = resolvePagination(query);
    const where = { customerId, status: query.status };
    const [list, total] = await Promise.all([
      this.prisma.customerCoupon.findMany({
        where,
        include: { template: true },
        orderBy: { receivedAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.customerCoupon.count({ where }),
    ]);
    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 统计用户可用优惠券数量。
   */
  countAvailable(customerId: string) {
    return this.prisma.customerCoupon.count({
      where: { customerId, status: CustomerCouponStatus.AVAILABLE },
    });
  }

  /**
   * 领取优惠券模板。
   */
  async claim(customerId: string, templateId: string) {
    return this.prisma.$transaction(async (tx) => {
      const template = await tx.couponTemplate.findFirst({
        where: { id: templateId, enabled: true },
      });
      if (!template) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "优惠券不存在", HttpStatus.NOT_FOUND);
      }
      if (template.totalStock !== null && template.receivedCount >= template.totalStock) {
        throw new BusinessException(ErrorCode.BUSINESS_ERROR, "优惠券已领完");
      }

      const coupon = await tx.customerCoupon.create({
        data: {
          customerId,
          templateId,
        },
        include: { template: true },
      });

      await tx.couponTemplate.update({
        where: { id: templateId },
        data: { receivedCount: { increment: 1 } },
      });

      return coupon;
    });
  }
}
