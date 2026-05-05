import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
/**
 * Persists upload metadata for the local storage adapter.
 */
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Saves metadata for one uploaded local file.
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
}
