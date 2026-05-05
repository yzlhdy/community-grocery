import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { diskStorage, memoryStorage } from "multer";
import { mkdirSync } from "node:fs";
import { extname } from "node:path";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { UploadService } from "./upload.service";

/**
 * 根据本地上传目录配置构建 Multer 磁盘存储。
 */
function storageFactory() {
  return diskStorage({
    destination: (_request, _file, callback) => {
      const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
      mkdirSync(uploadDir, { recursive: true });
      callback(null, uploadDir);
    },
    filename: (_request, file, callback) => {
      const suffix = `${Date.now()}-${Math.random().toString().slice(2, 8)}`;
      callback(null, `${suffix}${extname(file.originalname)}`);
    },
  });
}

@ApiTags("上传")
@Controller("uploads")
/**
 * 后台资源上传接口。
 */
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("local")
  @ApiBearerAuth()
  @ApiOperation({ summary: "上传本地文件" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "上传文件表单",
    schema: {
      type: "object",
      properties: {
        file: {
          description: "文件内容",
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseGuards(JwtRoleGuard("admin"))
  @UseInterceptors(
    FileInterceptor("file", {
      storage: storageFactory(),
    }),
  )
  /**
   * 上传一个文件到本地存储，并记录资源元数据。
   */
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.saveLocalAsset(file);
  }

  @Post("minio")
  @ApiBearerAuth()
  @ApiOperation({ summary: "上传文件到 MinIO" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "上传文件表单",
    schema: {
      type: "object",
      properties: {
        file: {
          description: "文件内容",
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseGuards(JwtRoleGuard("admin"))
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
    }),
  )
  /**
   * 上传一个文件到 MinIO，并记录资源元数据。
   */
  uploadToMinio(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.saveMinioAsset(file);
  }
}
