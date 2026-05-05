import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
/**
 * Application-wide Redis provider for idempotency and short-lived locks.
 */
export class RedisService implements OnModuleDestroy {
  readonly client: Redis;

  constructor(configService: ConfigService) {
    this.client = new Redis(configService.getOrThrow<string>("REDIS_URL"));
  }

  /**
   * Stores an idempotency key if it does not already exist.
   */
  async setIdempotencyKey(key: string, ttlSeconds: number) {
    const result = await this.client.set(key, "1", "EX", ttlSeconds, "NX");
    return result === "OK";
  }

  /**
   * Closes the Redis connection when Nest shuts down.
   */
  async onModuleDestroy() {
    await this.client.quit();
  }
}
