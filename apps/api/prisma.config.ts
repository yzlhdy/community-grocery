import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Central Prisma CLI configuration.
 *
 * Prisma 7 no longer accepts connection URLs inside `schema.prisma`.
 * Keeping the URL here makes migrate/generate/studio read the same
 * `DATABASE_URL` while the schema only describes database shape.
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
