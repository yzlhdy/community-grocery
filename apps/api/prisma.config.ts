import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma CLI 统一配置。
 *
 * Prisma 7 不再允许在 `schema.prisma` 中配置连接地址。
 * 这里统一读取 `DATABASE_URL`，让 migrate/generate/studio 使用同一套连接配置，
 * `schema.prisma` 只负责描述数据库结构。
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
