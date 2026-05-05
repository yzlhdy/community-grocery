import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { HomeQueryDto } from "./dto/home-query.dto";
import { MiniappService } from "./miniapp.service";

@ApiTags("小程序页面")
@Controller("miniapp")
/**
 * 小程序页面级聚合接口。
 */
export class MiniappController {
  constructor(private readonly miniappService: MiniappService) {}

  @Get("home")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询首页聚合数据" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询首页首屏需要的定位、分类、banner、秒杀、推荐和角标数据。
   */
  getHome(@CurrentUser() user: AuthUser, @Query() query: HomeQueryDto) {
    return this.miniappService.getHome(user.sub, query);
  }

  @Get("category-page")
  @ApiOperation({ summary: "查询分类页聚合数据" })
  @ApiQuery({ name: "categoryId", required: false, description: "当前选中的分类 ID" })
  /**
   * 查询分类页左侧分类和右侧商品列表。
   */
  getCategoryPage(@Query("categoryId") categoryId?: string) {
    return this.miniappService.getCategoryPage(categoryId);
  }

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询我的页面聚合数据" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询我的页面需要的用户、订单、优惠券和常用功能数量。
   */
  getMine(@CurrentUser() user: AuthUser) {
    return this.miniappService.getMine(user.sub);
  }
}
