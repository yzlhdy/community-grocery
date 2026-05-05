import { OmitType, PartialType } from "@nestjs/swagger";
import { UpsertCommunityDto } from "./upsert-community.dto";

/**
 * 更新小区参数。
 */
export class UpdateCommunityDto extends PartialType(OmitType(UpsertCommunityDto, ["id"] as const)) {}
