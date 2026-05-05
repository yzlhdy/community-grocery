import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { OrderService } from "./order.service";
import { OrderStatus } from "../../generated/prisma/client";

@ApiTags("订单")
@Controller("orders")
/**
 * 用户订单和后台自提核销接口。
 */
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询我的订单" })
  @ApiQuery({ name: "status", enum: OrderStatus, required: false, description: "订单状态" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询当前登录用户的订单列表。
   */
  findMine(@CurrentUser() user: AuthUser, @Query() query: OrderQueryDto) {
    return this.orderService.findMine(user.sub, query);
  }

  @Get("mine/summary")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询我的订单状态汇总" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询当前登录用户的订单状态数量。
   */
  getSummary(@CurrentUser() user: AuthUser) {
    return this.orderService.getSummary(user.sub);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询订单详情" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 查询当前登录用户拥有的订单详情。
   */
  findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.orderService.findOne(id, user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建自提订单" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 根据所选 SKU 创建未支付自提订单。
   */
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orderService.create(user.sub, dto);
  }

  @Post(":id/cancel")
  @ApiBearerAuth()
  @ApiOperation({ summary: "取消未支付订单" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 取消当前登录用户的一笔未支付订单。
   */
  cancel(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.orderService.cancel(id, user.sub);
  }

  @Post(":id/reorder")
  @ApiBearerAuth()
  @ApiOperation({ summary: "再来一单" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 将历史订单中的商品重新加入购物车。
   */
  reorder(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.orderService.reorder(id, user.sub);
  }

  @Post(":id/complete-pickup")
  @ApiBearerAuth()
  @ApiOperation({ summary: "确认自提完成" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 后台确认用户已完成自提，需要后台管理员登录。
   */
  completePickup(@Param("id") id: string) {
    return this.orderService.completePickup(id);
  }
}
