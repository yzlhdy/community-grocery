import { Injectable, Logger, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
/**
 * 应用级 Redis 提供者，用于幂等键和短期锁。
 */
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  readonly client: Redis;

  constructor(configService: ConfigService) {
    this.client = new Redis(configService.getOrThrow<string>("REDIS_URL"), {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
    });

    this.client.on("error", (error) => {
      this.logger.warn(`Redis 连接异常：${error.message}`);
    });
    this.client.on("ready", () => {
      this.logger.log("Redis 连接已就绪");
    });
    this.client.on("end", () => {
      this.logger.warn("Redis 连接已断开");
    });
  }

  /**
   * Nest 初始化模块时尝试连接 Redis；连接失败不阻塞应用启动。
   */
  async onModuleInit() {
    try {
      await this.ensureConnected();
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      this.logger.warn(`Redis 暂不可用，依赖 Redis 的接口会失败：${message}`);
    }
  }

  /**
   * 在幂等键不存在时写入，并设置过期时间。
   */
  async setIdempotencyKey(key: string, ttlSeconds: number) {
    await this.ensureConnected();
    const result = await this.client.set(key, "1", "EX", ttlSeconds, "NX");
    return result === "OK";
  }

  /**
   * 确保 Redis 已连接；连接失败时返回明确的服务不可用异常。
   */
  private async ensureConnected() {
    if (this.client.status === "ready") {
      return;
    }

    try {
      await this.client.connect();
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      throw new ServiceUnavailableException(`Redis 未连接：${message}`);
    }
  }

  /**
   * Nest 关闭时断开 Redis 连接。
   */
  async onModuleDestroy() {
    if (this.client.status === "ready") {
      await this.client.quit();
      return;
    }

    this.client.disconnect();
  }
}
