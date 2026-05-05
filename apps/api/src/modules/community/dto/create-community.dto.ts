import { OmitType } from "@nestjs/swagger";
import { UpsertCommunityDto } from "./upsert-community.dto";

/**
 * 创建小区参数。
 */
export class CreateCommunityDto extends OmitType(UpsertCommunityDto, ["id"] as const) {}
