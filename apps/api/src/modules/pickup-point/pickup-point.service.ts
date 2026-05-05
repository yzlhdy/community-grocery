import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UpsertPickupPointDto } from "./dto/upsert-pickup-point.dto";

@Injectable()
/**
 * Provides pickup point query and admin upsert operations.
 */
export class PickupPointService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists enabled pickup points for a community.
   */
  findByCommunity(communityId: string) {
    return this.prisma.pickupPoint.findMany({
      where: { communityId, enabled: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Creates or updates a pickup point.
   */
  upsert(dto: UpsertPickupPointDto) {
    const data = {
      communityId: dto.communityId,
      name: dto.name,
      address: dto.address,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      pickupTimeRange: dto.pickupTimeRange,
      enabled: dto.enabled ?? true,
    };
    return dto.id
      ? this.prisma.pickupPoint.update({ where: { id: dto.id }, data })
      : this.prisma.pickupPoint.create({ data });
  }
}
