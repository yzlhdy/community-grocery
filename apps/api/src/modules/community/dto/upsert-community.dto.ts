import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

/**
 * Payload for creating or updating one community.
 */
export class UpsertCommunityDto {
  /** Existing community id. Omit to create a new community. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  /** Community name. */
  @ApiProperty({ example: "幸福里小区" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** Community address. */
  @ApiProperty({ example: "幸福路 88 号" })
  @IsString()
  @MinLength(1)
  address!: string;

  /** Whether this community is selectable. */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
