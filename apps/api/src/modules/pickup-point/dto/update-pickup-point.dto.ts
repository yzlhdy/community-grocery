import { OmitType, PartialType } from "@nestjs/swagger";
import { UpsertPickupPointDto } from "./upsert-pickup-point.dto";

/**
 * 更新自提点参数。
 */
export class UpdatePickupPointDto extends PartialType(OmitType(UpsertPickupPointDto, ["id"] as const)) {}
