import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
/**
 * Application-wide Prisma client provider.
 */
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Creates Prisma Client with the PostgreSQL driver adapter required by Prisma 7.
   */
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  /**
   * Opens the database connection when Nest initializes the module.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Closes the database connection when Nest shuts down.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
