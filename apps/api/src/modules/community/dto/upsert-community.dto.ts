import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

/**
 * 创建或更新小区的参数。
 */
export class UpsertCommunityDto {
  /** 已存在的小区 ID，不传则创建新小区。 */
  @ApiPropertyOptional({ description: "已存在的小区 ID，不传则创建新小区" })
  @IsOptional()
  @IsString()
  id?: string;

  /** 小区名称。 */
  @ApiProperty({ description: "小区名称", example: "幸福里小区" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** 小区地址。 */
  @ApiProperty({ description: "小区地址", example: "幸福路 88 号" })
  @IsString()
  @MinLength(1)
  address!: string;

  /** 小区是否可选择。 */
  @ApiPropertyOptional({ description: "小区是否可选择", default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
