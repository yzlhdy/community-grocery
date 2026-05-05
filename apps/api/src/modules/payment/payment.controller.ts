import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { WechatNotifyDto } from "./dto/wechat-notify.dto";
import { PaymentService } from "./payment.service";

@ApiTags("payments")
@Controller("payments")
/**
 * Payment endpoints for WeChat payment requests and callbacks.
 */
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("wechat/orders/:orderId")
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * Creates WeChat mini program payment parameters for a customer order.
   */
  createWechatPayment(@CurrentUser() user: AuthUser, @Param("orderId") orderId: string) {
    return this.paymentService.createWechatPayment(orderId, user.sub);
  }

  @Post("wechat/notify")
  /**
   * Receives WeChat payment callbacks.
   */
  handleWechatNotify(@Body() dto: WechatNotifyDto) {
    return this.paymentService.handleWechatNotify(dto);
  }

  @Get("orders/:orderId")
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * Lists payments for an order. Requires admin authentication.
   */
  findByOrder(@Param("orderId") orderId: string) {
    return this.paymentService.findByOrder(orderId);
  }
}
