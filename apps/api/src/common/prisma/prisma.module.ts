import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
/**
 * 全局 Prisma 模块，业务模块可直接注入 `PrismaService`。
 */
export class PrismaModule {}
