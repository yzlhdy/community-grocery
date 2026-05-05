import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
/**
 * Global Redis module so feature modules can inject `RedisService`.
 */
export class RedisModule {}
