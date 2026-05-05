import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

/**
 * 创建或更新收货地址的参数。
 */
export class UpsertAddressDto {
  /** 已存在的地址 ID，不传则创建新地址。 */
  @ApiPropertyOptional({ description: "已存在的地址 ID，不传则创建新地址" })
  @IsOptional()
  @IsString()
  id?: string;

  /** 联系人姓名。 */
  @ApiProperty({ description: "联系人姓名", example: "李团长" })
  @IsString()
  @MinLength(1)
  contactName!: string;

  /** 联系电话。 */
  @ApiProperty({ description: "联系电话", example: "13800000000" })
  @IsString()
  @MinLength(1)
  contactPhone!: string;

  /** 省份。 */
  @ApiPropertyOptional({ description: "省份" })
  @IsOptional()
  @IsString()
  province?: string;

  /** 城市。 */
  @ApiPropertyOptional({ description: "城市" })
  @IsOptional()
  @IsString()
  city?: string;

  /** 区县。 */
  @ApiPropertyOptional({ description: "区县" })
  @IsOptional()
  @IsString()
  district?: string;

  /** 详细地址。 */
  @ApiProperty({ description: "详细地址", example: "幸福里小区 1 栋 101" })
  @IsString()
  @MinLength(1)
  detailAddress!: string;

  /** 是否默认地址。 */
  @ApiPropertyOptional({ description: "是否默认地址", default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
