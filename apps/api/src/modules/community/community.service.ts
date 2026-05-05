import { Injectable } from "@nestjs/common";
import { createPageResult } from "../../common/utils/pagination";
import { CommunityRepository } from "./community.repository";
import { CommunityQueryDto } from "./dto/community-query.dto";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";

@Injectable()
/**
 * 提供小区查询和后台小区写入能力。
 */
export class CommunityService {
  constructor(private readonly communityRepository: CommunityRepository) {}

  /**
   * 查询已启用的小区及其已启用自提点。
   */
  findMany() {
    return this.communityRepository.findEnabled();
  }

  /**
   * 后台分页查询小区。
   */
  async findPage(query: CommunityQueryDto) {
    const page = await this.communityRepository.findPage(query);
    return createPageResult(page);
  }

  /**
   * 创建小区。
   */
  create(dto: CreateCommunityDto) {
    return this.communityRepository.create(dto);
  }

  /**
   * 更新小区。
   */
  update(id: string, dto: UpdateCommunityDto) {
    return this.communityRepository.update(id, dto);
  }

  /**
   * 删除小区。
   */
  delete(id: string) {
    return this.communityRepository.delete(id);
  }
}
