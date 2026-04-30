import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CartModule } from "./cart/cart.module";
import { CategoryModule } from "./category/category.module";
import { CommunityModule } from "./community/community.module";
import { CouponModule } from "./coupon/coupon.module";
import { HealthModule } from "./health/health.module";
import { NotificationModule } from "./notification/notification.module";
import { OrderModule } from "./order/order.module";
import { PaymentModule } from "./payment/payment.module";
import { PickupPointModule } from "./pickup-point/pickup-point.module";
import { ProductModule } from "./product/product.module";
import { UploadModule } from "./upload/upload.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    UserModule,
    CommunityModule,
    PickupPointModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    CouponModule,
    UploadModule,
    NotificationModule,
  ],
})
export class AppModule {}
