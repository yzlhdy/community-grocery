import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { validateEnv } from "../common/env";
import { PrismaModule } from "../common/prisma/prisma.module";
import { RedisModule } from "../common/redis/redis.module";
import { AfterSaleModule } from "./after-sale/after-sale.module";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { CategoryModule } from "./category/category.module";
import { CommunityModule } from "./community/community.module";
import { CouponModule } from "./coupon/coupon.module";
import { HealthModule } from "./health/health.module";
import { InventoryModule } from "./inventory/inventory.module";
import { MarketingModule } from "./marketing/marketing.module";
import { MiniappModule } from "./miniapp/miniapp.module";
import { NotificationModule } from "./notification/notification.module";
import { OrderModule } from "./order/order.module";
import { PaymentModule } from "./payment/payment.module";
import { PickupPointModule } from "./pickup-point/pickup-point.module";
import { PointsModule } from "./points/points.module";
import { ProductModule } from "./product/product.module";
import { ReviewModule } from "./review/review.module";
import { UploadModule } from "./upload/upload.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env", "../../.env.example"],
      validate: validateEnv,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as "7d",
      },
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    HealthModule,
    UserModule,
    CommunityModule,
    PickupPointModule,
    InventoryModule,
    MarketingModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    CouponModule,
    PointsModule,
    AfterSaleModule,
    ReviewModule,
    MiniappModule,
    UploadModule,
    NotificationModule,
  ],
})
/**
 * API 根模块，负责装配基础设施模块和业务模块。
 */
export class AppModule {}
