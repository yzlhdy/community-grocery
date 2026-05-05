import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AssetStorage } from "../../generated/prisma/client";
import { MinioStorageService } from "./storage/minio-storage.service";

@Injectable()
/**
 * 为本地存储适配器保存上传资源元数据。
 */
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioStorageService: MinioStorageService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 保存一个本地上传文件的元数据。
   */
  saveLocalAsset(file: Express.Multer.File) {
    const uploadDir = this.configService.get<string>("UPLOAD_DIR") ?? "uploads";
    return this.prisma.uploadAsset.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/${uploadDir}/${file.filename}`,
      },
    });
  }

  /**
   * 上传文件到 MinIO 并保存资源元数据。
   */
  async saveMinioAsset(file: Express.Multer.File) {
    const uploaded = await this.minioStorageService.upload(file);
    return this.prisma.uploadAsset.create({
      data: {
        storage: AssetStorage.MINIO,
        filename: uploaded.objectName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: uploaded.objectName,
        url: uploaded.url,
      },
    });
  }
}
