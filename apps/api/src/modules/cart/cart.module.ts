import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  controllers: [CartController],
  providers: [CartService],
})
/**
 * 小程序购物车模块。
 */
export class CartModule {}
