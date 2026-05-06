import { Injectable } from "@nestjs/common";
import { createPageResult } from "../../common/utils/pagination";
import { presentPickupPoint } from "../community/community.presenter";
import { CreatePickupPointDto } from "./dto/create-pickup-point.dto";
import { PickupPointQueryDto } from "./dto/pickup-point-query.dto";
import { UpdatePickupPointDto } from "./dto/update-pickup-point.dto";
import { PickupPointRepository } from "./pickup-point.repository";

@Injectable()
/**
 * 提供自提点查询和后台自提点写入能力。
 */
export class PickupPointService {
  constructor(private readonly pickupPointRepository: PickupPointRepository) {}

  /**
   * 查询指定小区下已启用的自提点。
   */
  findByCommunity(communityId: string) {
    return this.pickupPointRepository
      .findEnabledByCommunity(communityId)
      .then((list) => list.map(presentPickupPoint));
  }

  /**
   * 后台分页查询自提点。
   */
  async findPage(query: PickupPointQueryDto) {
    const page = await this.pickupPointRepository.findPage(query);
    return createPageResult({ ...page, list: page.list.map(presentPickupPoint) });
  }

  /**
   * 创建自提点。
   */
  create(dto: CreatePickupPointDto) {
    return this.pickupPointRepository.create(dto).then(presentPickupPoint);
  }

  /**
   * 更新自提点。
   */
  update(id: string, dto: UpdatePickupPointDto) {
    return this.pickupPointRepository.update(id, dto).then(presentPickupPoint);
  }

  /**
   * 删除自提点。
   */
  delete(id: string) {
    return this.pickupPointRepository.delete(id).then(presentPickupPoint);
  }
}
