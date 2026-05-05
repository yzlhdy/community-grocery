import { Module } from "@nestjs/common";
import { InventoryModule } from "../inventory/inventory.module";
import { NotificationModule } from "../notification/notification.module";
import { PointsModule } from "../points/points.module";
import { PaymentController } from "./payment.controller";
import { MockWechatPaymentProvider } from "./providers/mock-wechat-payment.provider";
import { WECHAT_PAYMENT_PROVIDER } from "./providers/wechat-payment.types";
import { PaymentService } from "./payment.service";

@Module({
  imports: [InventoryModule, NotificationModule, PointsModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    MockWechatPaymentProvider,
    {
      provide: WECHAT_PAYMENT_PROVIDER,
      useExisting: MockWechatPaymentProvider,
    },
  ],
})
/**
 * 支付模块。
 */
export class PaymentModule {}
