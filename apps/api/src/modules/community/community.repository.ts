import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { resolvePagination } from "../../common/utils/pagination";
import { CommunityQueryDto } from "./dto/community-query.dto";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";

/**
 * 小区数据访问层。
 */
@Injectable()
export class CommunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询用户可选小区。
   */
  findEnabled() {
    return this.prisma.community.findMany({
      where: { enabled: true },
      include: { pickupPoints: { where: { enabled: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * 后台分页查询小区。
   */
  async findPage(query: CommunityQueryDto) {
    const pagination = resolvePagination(query);
    const where = {
      enabled: query.enabled === undefined ? undefined : query.enabled === "true",
      name: query.keyword ? { contains: query.keyword, mode: "insensitive" as const } : undefined,
    };
    const [list, total] = await Promise.all([
      this.prisma.community.findMany({
        where,
        include: { pickupPoints: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.community.count({ where }),
    ]);
    return { list, total, ...pagination };
  }

  /**
   * 创建小区。
   */
  create(dto: CreateCommunityDto) {
    return this.prisma.community.create({
      data: {
        name: dto.name,
        address: dto.address,
        enabled: dto.enabled ?? true,
      },
    });
  }

  /**
   * 更新小区。
   */
  update(id: string, dto: UpdateCommunityDto) {
    return this.prisma.community.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * 删除小区。
   */
  delete(id: string) {
    return this.prisma.community.delete({ where: { id } });
  }
}
