import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { mkdirSync } from "node:fs";
import { extname } from "node:path";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { UploadService } from "./upload.service";

/**
 * Builds Multer disk storage using the configured local upload directory.
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

@ApiTags("uploads")
@Controller("uploads")
/**
 * Upload endpoints for admin-managed assets.
 */
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("local")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
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
   * Uploads one file to local storage and records it as an asset.
   */
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.saveLocalAsset(file);
  }
}
