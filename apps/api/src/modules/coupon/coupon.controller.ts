import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { CustomerCouponStatus } from "../../generated/prisma/client";
import { CouponQueryDto } from "./dto/coupon-query.dto";
import { CouponService } from "./coupon.service";

@ApiTags("优惠券")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("customer"))
@Controller("coupons")
/**
 * 小程序用户优惠券接口。
 */
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get("mine")
  @ApiOperation({ summary: "查询我的优惠券" })
  @ApiQuery({ name: "status", enum: CustomerCouponStatus, required: false, description: "优惠券状态" })
  /**
   * 查询当前登录用户的优惠券列表。
   */
  findMine(@CurrentUser() user: AuthUser, @Query() query: CouponQueryDto) {
    return this.couponService.findMine(user.sub, query);
  }

  @Post("templates/:templateId/claim")
  @ApiOperation({ summary: "领取优惠券" })
  /**
   * 领取指定优惠券模板。
   */
  claim(@CurrentUser() user: AuthUser, @Param("templateId") templateId: string) {
    return this.couponService.claim(user.sub, templateId);
  }
}
