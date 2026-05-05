import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "minio";

/**
 * MinIO 对象存储适配器。
 */
@Injectable()
export class MinioStorageService {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly publicBaseUrl?: string;

  constructor(configService: ConfigService) {
    this.bucket = configService.get<string>("MINIO_BUCKET") ?? "community-grocery";
    this.publicBaseUrl = configService.get<string>("MINIO_PUBLIC_BASE_URL");
    this.client = new Client({
      endPoint: configService.get<string>("MINIO_ENDPOINT") ?? "localhost",
      port: Number(configService.get<string>("MINIO_PORT") ?? 9000),
      useSSL: configService.get<string>("MINIO_USE_SSL") === "true",
      accessKey: configService.get<string>("MINIO_ACCESS_KEY") ?? "minioadmin",
      secretKey: configService.get<string>("MINIO_SECRET_KEY") ?? "minioadmin",
    });
  }

  /**
   * 上传文件到 MinIO 并返回访问路径。
   */
  async upload(file: Express.Multer.File) {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }

    const objectName = `uploads/${Date.now()}-${Math.random().toString().slice(2, 8)}-${file.originalname}`;
    await this.client.putObject(this.bucket, objectName, file.buffer, file.size, {
      "Content-Type": file.mimetype,
    });

    return {
      objectName,
      url: this.publicBaseUrl
        ? `${this.publicBaseUrl.replace(/\/$/, "")}/${objectName}`
        : `/${this.bucket}/${objectName}`,
    };
  }
}
