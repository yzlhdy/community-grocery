import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

/**
 * Payload for creating or updating one pickup point.
 */
export class UpsertPickupPointDto {
  /** Existing pickup point id. Omit to create a new pickup point. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  /** Parent community id. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  communityId!: string;

  /** Pickup point name. */
  @ApiProperty({ example: "北门自提点" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** Pickup address. */
  @ApiProperty({ example: "幸福里北门便利店" })
  @IsString()
  @MinLength(1)
  address!: string;

  /** Contact person name. */
  @ApiProperty({ example: "王师傅" })
  @IsString()
  @MinLength(1)
  contactName!: string;

  /** Contact phone number. */
  @ApiProperty({ example: "13800000000" })
  @IsString()
  @MinLength(1)
  contactPhone!: string;

  /** Human-readable pickup time range. */
  @ApiProperty({ example: "今日 16:00-20:00" })
  @IsString()
  @MinLength(1)
  pickupTimeRange!: string;

  /** Whether this pickup point is enabled. */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
