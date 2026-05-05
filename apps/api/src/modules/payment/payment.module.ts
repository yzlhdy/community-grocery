import { Module } from "@nestjs/common";
import { InventoryModule } from "../inventory/inventory.module";
import { PaymentController } from "./payment.controller";
import { MockWechatPaymentProvider } from "./providers/mock-wechat-payment.provider";
import { WECHAT_PAYMENT_PROVIDER } from "./providers/wechat-payment.types";
import { PaymentService } from "./payment.service";

@Module({
  imports: [InventoryModule],
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
 * Payment module.
 */
export class PaymentModule {}
