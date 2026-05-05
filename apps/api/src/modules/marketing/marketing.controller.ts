import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BannerScene, PromotionType } from "../../generated/prisma/client";
import { MarketingService } from "./marketing.service";

@ApiTags("营销")
@Controller("marketing")
/**
 * 营销资源查询接口。
 */
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get("banners")
  @ApiOperation({ summary: "查询 banner 列表" })
  @ApiQuery({ name: "scene", enum: BannerScene, required: false, description: "banner 场景" })
  /**
   * 查询当前生效的 banner。
   */
  findBanners(@Query("scene") scene?: BannerScene) {
    return this.marketingService.findActiveBanners(scene);
  }

  @Get("campaigns/active")
  @ApiOperation({ summary: "查询当前营销活动" })
  @ApiQuery({ name: "type", enum: PromotionType, description: "营销活动类型" })
  /**
   * 查询当前生效的营销活动。
   */
  findActiveCampaign(@Query("type") type: PromotionType) {
    return this.marketingService.findActiveCampaign(type);
  }

  @Get("coupon-templates")
  @ApiOperation({ summary: "查询可领取优惠券" })
  /**
   * 查询当前可领取优惠券模板。
   */
  findCouponTemplates() {
    return this.marketingService.findActiveCouponTemplates();
  }
}
