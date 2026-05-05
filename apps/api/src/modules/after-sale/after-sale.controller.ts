import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { AfterSaleService } from "./after-sale.service";
import { AfterSaleQueryDto } from "./dto/after-sale-query.dto";
import { CreateAfterSaleDto } from "./dto/create-after-sale.dto";
import { ReviewAfterSaleDto } from "./dto/review-after-sale.dto";

@ApiTags("售后")
@Controller("after-sales")
/**
 * 售后申请、审核和退款接口。
 */
export class AfterSaleController {
  constructor(private readonly afterSaleService: AfterSaleService) {}

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询我的售后单" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询当前登录用户售后单。
   */
  findMine(@CurrentUser() user: AuthUser, @Query() query: AfterSaleQueryDto) {
    return this.afterSaleService.findMine(user.sub, query);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询售后详情" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询当前登录用户售后详情。
   */
  findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.afterSaleService.findOne(id, user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建售后申请" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 创建售后申请。
   */
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateAfterSaleDto) {
    return this.afterSaleService.create(user.sub, dto);
  }

  @Post(":id/review")
  @ApiBearerAuth()
  @ApiOperation({ summary: "后台审核售后单" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 后台审核售后单。
   */
  review(@Param("id") id: string, @Body() dto: ReviewAfterSaleDto) {
    return this.afterSaleService.review(id, dto);
  }

  @Post(":id/refunded")
  @ApiBearerAuth()
  @ApiOperation({ summary: "确认售后退款完成" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 后台确认售后退款完成。
   */
  markRefunded(@Param("id") id: string) {
    return this.afterSaleService.markRefunded(id);
  }
}
