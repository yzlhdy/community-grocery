import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
/**
 * Global Prisma module so feature modules can inject `PrismaService`.
 */
export class PrismaModule {}
