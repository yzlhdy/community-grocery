import { Module } from "@nestjs/common";
import { MarketingModule } from "../marketing/marketing.module";
import { UserModule } from "../user/user.module";
import { MiniappController } from "./miniapp.controller";
import { MiniappService } from "./miniapp.service";

@Module({
  imports: [MarketingModule, UserModule],
  controllers: [MiniappController],
  providers: [MiniappService],
})
/**
 * 小程序页面聚合模块，按页面组织跨领域数据。
 */
export class MiniappModule {}
