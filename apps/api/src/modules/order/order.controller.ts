import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";

@ApiTags("orders")
@Controller("orders")
/**
 * Order endpoints for customers and pickup completion by admins.
 */
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("mine")
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * Lists orders for the authenticated customer.
   */
  findMine(@CurrentUser() user: AuthUser) {
    return this.orderService.findMine(user.sub);
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * Reads one order owned by the authenticated customer.
   */
  findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.orderService.findOne(id, user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * Creates an unpaid order from selected SKU items.
   */
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orderService.create(user.sub, dto);
  }

  @Post(":id/cancel")
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * Cancels one unpaid customer order.
   */
  cancel(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.orderService.cancel(id, user.sub);
  }

  @Post(":id/complete-pickup")
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * Completes pickup for a paid order. Requires admin authentication.
   */
  completePickup(@Param("id") id: string) {
    return this.orderService.completePickup(id);
  }
}
