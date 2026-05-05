import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UpsertCommunityDto } from "./dto/upsert-community.dto";

@Injectable()
/**
 * Provides community query and admin upsert operations.
 */
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists enabled communities with enabled pickup points.
   */
  findMany() {
    return this.prisma.community.findMany({
      where: { enabled: true },
      include: { pickupPoints: { where: { enabled: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Creates or updates a community.
   */
  upsert(dto: UpsertCommunityDto) {
    const data = {
      name: dto.name,
      address: dto.address,
      enabled: dto.enabled ?? true,
    };
    return dto.id
      ? this.prisma.community.update({ where: { id: dto.id }, data })
      : this.prisma.community.create({ data });
  }
}
