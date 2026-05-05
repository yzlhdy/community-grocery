import { Module } from "@nestjs/common";
import { MarketingController } from "./marketing.controller";
import { MarketingService } from "./marketing.service";

@Module({
  controllers: [MarketingController],
  providers: [MarketingService],
  exports: [MarketingService],
})
/**
 * 营销模块，负责 banner、秒杀、推荐位和优惠券模板。
 */
export class MarketingModule {}
