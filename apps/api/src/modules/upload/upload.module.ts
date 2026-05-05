import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
/**
 * Upload module.
 */
export class UploadModule {}
