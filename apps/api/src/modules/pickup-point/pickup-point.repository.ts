import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { resolvePagination } from "../../common/utils/pagination";
import { CreatePickupPointDto } from "./dto/create-pickup-point.dto";
import { PickupPointQueryDto } from "./dto/pickup-point-query.dto";
import { UpdatePickupPointDto } from "./dto/update-pickup-point.dto";

/**
 * 自提点数据访问层。
 */
@Injectable()
export class PickupPointRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询指定小区下已启用的自提点。
   */
  findEnabledByCommunity(communityId: string) {
    return this.prisma.pickupPoint.findMany({
      where: { communityId, enabled: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * 后台分页查询自提点。
   */
  async findPage(query: PickupPointQueryDto) {
    const pagination = resolvePagination(query);
    const where = {
      deletedAt: null,
      communityId: query.communityId,
      enabled: query.enabled === undefined ? undefined : query.enabled === "true",
      name: query.keyword ? { contains: query.keyword, mode: "insensitive" as const } : undefined,
    };
    const [list, total] = await Promise.all([
      this.prisma.pickupPoint.findMany({
        where,
        include: { community: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.pickupPoint.count({ where }),
    ]);
    return { list, total, ...pagination };
  }

  /**
   * 创建自提点。
   */
  create(dto: CreatePickupPointDto) {
    return this.prisma.pickupPoint.create({
      data: { ...dto, enabled: dto.enabled ?? true },
    });
  }

  /**
   * 更新自提点。
   */
  update(id: string, dto: UpdatePickupPointDto) {
    return this.prisma.pickupPoint.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * 删除自提点。
   */
  delete(id: string) {
    return this.prisma.pickupPoint.update({
      where: { id },
      data: {
        enabled: false,
        deletedAt: new Date(),
      },
    });
  }
}
