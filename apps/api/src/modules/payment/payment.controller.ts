import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { WechatNotifyDto } from "./dto/wechat-notify.dto";
import { PaymentService } from "./payment.service";

@ApiTags("支付")
@Controller("payments")
/**
 * 微信支付下单、回调和支付记录查询接口。
 */
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("wechat/orders/:orderId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建微信小程序支付参数" })
  @UseGuards(JwtRoleGuard("customer"))
  /**
   * 为用户订单创建微信小程序支付参数。
   */
  createWechatPayment(@CurrentUser() user: AuthUser, @Param("orderId") orderId: string) {
    return this.paymentService.createWechatPayment(orderId, user.sub);
  }

  @Post("wechat/notify")
  @ApiOperation({ summary: "接收微信支付回调" })
  /**
   * 接收微信支付回调并做幂等处理。
   */
  handleWechatNotify(@Body() dto: WechatNotifyDto) {
    return this.paymentService.handleWechatNotify(dto);
  }

  @Get("orders/:orderId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "查询订单支付记录" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 查询订单支付记录，需要后台管理员登录。
   */
  findByOrder(@Param("orderId") orderId: string) {
    return this.paymentService.findByOrder(orderId);
  }
}
