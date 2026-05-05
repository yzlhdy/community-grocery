import { Module } from "@nestjs/common";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./coupon.service";

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
/**
 * 优惠券模块，负责领券、我的优惠券和可用券统计。
 */
export class CouponModule {}
