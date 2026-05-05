import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { UpsertAddressDto } from "./dto/upsert-address.dto";
import { UserService } from "./user.service";

@ApiTags("用户中心")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("customer"))
@Controller("users/me")
/**
 * 小程序“我的”页面及用户行为接口。
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("summary")
  @ApiOperation({ summary: "查询我的页面汇总" })
  /**
   * 查询我的页面所需的用户、订单、优惠券、收藏和浏览统计。
   */
  getProfileSummary(@CurrentUser() user: AuthUser) {
    return this.userService.getProfileSummary(user.sub);
  }

  @Get("favorites")
  @ApiOperation({ summary: "查询我的收藏" })
  /**
   * 查询当前用户收藏的商品。
   */
  findFavoriteProducts(@CurrentUser() user: AuthUser, @Query() query: PageQueryDto) {
    return this.userService.findFavoriteProducts(user.sub, query);
  }

  @Post("favorites/:productId")
  @ApiOperation({ summary: "收藏商品" })
  /**
   * 收藏指定商品。
   */
  favoriteProduct(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.userService.favoriteProduct(user.sub, productId);
  }

  @Delete("favorites/:productId")
  @ApiOperation({ summary: "取消收藏商品" })
  /**
   * 取消收藏指定商品。
   */
  unfavoriteProduct(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.userService.unfavoriteProduct(user.sub, productId);
  }

  @Post("browsing-history/:productId")
  @ApiOperation({ summary: "记录浏览历史" })
  /**
   * 记录商品浏览历史。
   */
  recordBrowsingHistory(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.userService.recordBrowsingHistory(user.sub, productId);
  }

  @Get("browsing-history")
  @ApiOperation({ summary: "查询浏览历史" })
  /**
   * 查询当前用户的商品浏览历史。
   */
  findBrowsingHistory(@CurrentUser() user: AuthUser, @Query() query: PageQueryDto) {
    return this.userService.findBrowsingHistory(user.sub, query);
  }

  @Get("addresses")
  @ApiOperation({ summary: "查询收货地址" })
  /**
   * 查询当前用户的收货地址列表。
   */
  findAddresses(@CurrentUser() user: AuthUser) {
    return this.userService.findAddresses(user.sub);
  }

  @Post("addresses")
  @ApiOperation({ summary: "创建或更新收货地址" })
  /**
   * 创建或更新当前用户的收货地址。
   */
  upsertAddress(@CurrentUser() user: AuthUser, @Body() dto: UpsertAddressDto) {
    return this.userService.upsertAddress(user.sub, dto);
  }
}
