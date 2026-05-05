import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
/**
 * 应用级 Prisma 客户端提供者。
 */
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * 使用 Prisma 7 所需的 PostgreSQL 驱动适配器创建 Prisma Client。
   */
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  /**
   * Nest 初始化模块时打开数据库连接。
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Nest 关闭时断开数据库连接。
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
