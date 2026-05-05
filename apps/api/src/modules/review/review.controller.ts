import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";

@ApiTags("评价")
@Controller("reviews")
/**
 * 商品评价接口。
 */
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get("products/:productId")
  @ApiOperation({ summary: "查询商品评价" })
  /**
   * 查询指定商品的评价列表。
   */
  findByProduct(@Param("productId") productId: string, @Query() query: PageQueryDto) {
    return this.reviewService.findByProduct(productId, query);
  }

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询我的评价" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询当前登录用户的评价列表。
   */
  findMine(@CurrentUser() user: AuthUser, @Query() query: PageQueryDto) {
    return this.reviewService.findMine(user.sub, query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建商品评价" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 创建商品评价。
   */
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(user.sub, dto);
  }
}
