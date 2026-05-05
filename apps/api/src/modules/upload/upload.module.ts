import { Module } from "@nestjs/common";
import { MinioStorageService } from "./storage/minio-storage.service";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
  controllers: [UploadController],
  providers: [UploadService, MinioStorageService],
})
/**
 * 上传模块。
 */
export class UploadModule {}
