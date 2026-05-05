import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
/**
 * 全局 Redis 模块，业务模块可直接注入 `RedisService`。
 */
export class RedisModule {}
