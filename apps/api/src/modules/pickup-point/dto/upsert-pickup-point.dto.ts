import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

/**
 * 创建或更新自提点的参数。
 */
export class UpsertPickupPointDto {
  /** 已存在的自提点 ID，不传则创建新自提点。 */
  @ApiPropertyOptional({ description: "已存在的自提点 ID，不传则创建新自提点" })
  @IsOptional()
  @IsString()
  id?: string;

  /** 所属小区 ID。 */
  @ApiProperty({ description: "所属小区 ID" })
  @IsString()
  @MinLength(1)
  communityId!: string;

  /** 自提点名称。 */
  @ApiProperty({ description: "自提点名称", example: "北门自提点" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** 自提地址。 */
  @ApiProperty({ description: "自提地址", example: "幸福里北门便利店" })
  @IsString()
  @MinLength(1)
  address!: string;

  /** 联系人姓名。 */
  @ApiProperty({ description: "联系人姓名", example: "王师傅" })
  @IsString()
  @MinLength(1)
  contactName!: string;

  /** 联系电话。 */
  @ApiProperty({ description: "联系电话", example: "13800000000" })
  @IsString()
  @MinLength(1)
  contactPhone!: string;

  /** 面向用户展示的自提时间段。 */
  @ApiProperty({ description: "面向用户展示的自提时间段", example: "今日 16:00-20:00" })
  @IsString()
  @MinLength(1)
  pickupTimeRange!: string;

  /** 自提点是否启用。 */
  @ApiPropertyOptional({ description: "自提点是否启用", default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
