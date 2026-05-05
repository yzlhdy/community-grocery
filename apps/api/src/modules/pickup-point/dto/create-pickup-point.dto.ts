import { OmitType } from "@nestjs/swagger";
import { UpsertPickupPointDto } from "./upsert-pickup-point.dto";

/**
 * 创建自提点参数。
 */
export class CreatePickupPointDto extends OmitType(UpsertPickupPointDto, ["id"] as const) {}
