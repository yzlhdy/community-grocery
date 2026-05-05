import { Module } from "@nestjs/common";
import { CouponModule } from "../coupon/coupon.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [CouponModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
/**
 * 用户中心模块，负责“我的”页面和用户行为数据。
 */
export class UserModule {}
