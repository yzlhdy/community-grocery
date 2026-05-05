import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

/**
 * 创建或更新商品下一个 SKU 的参数。
 */
export class UpsertSkuDto {
  /** 已存在的 SKU ID，不传则创建新 SKU。 */
  @ApiPropertyOptional({ description: "已存在的 SKU ID，不传则创建新 SKU" })
  @IsOptional()
  @IsString()
  id?: string;

  /** SKU 展示名称。 */
  @ApiProperty({ description: "SKU 展示名称", example: "约500g" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** 商品单位。 */
  @ApiProperty({ description: "商品单位", example: "份" })
  @IsString()
  @MinLength(1)
  unit!: string;

  /** 销售价。 */
  @ApiProperty({ description: "销售价", minimum: 0, example: 4.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  /** 用于划线展示的市场价。 */
  @ApiPropertyOptional({ description: "用于划线展示的市场价", minimum: 0, example: 6.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  marketPrice?: number;

  /** 实际库存。 */
  @ApiProperty({ description: "实际库存", minimum: 0, example: 100 })
  @IsInt()
  @Min(0)
  stock!: number;

  /** SKU 是否可售。 */
  @ApiPropertyOptional({ description: "SKU 是否可售", default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

/**
 * 创建或更新商品及可选 SKU 的参数。
 */
export class UpsertProductDto {
  /** 已存在的商品 ID，不传则创建新商品。 */
  @ApiPropertyOptional({ description: "已存在的商品 ID，不传则创建新商品" })
  @IsOptional()
  @IsString()
  id?: string;

  /** 所属分类 ID。 */
  @ApiProperty({ description: "所属分类 ID" })
  @IsString()
  @MinLength(1)
  categoryId!: string;

  /** 商品展示名称。 */
  @ApiProperty({ description: "商品展示名称", example: "上海青" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** 商品副标题。 */
  @ApiPropertyOptional({ description: "商品副标题", example: "当日采摘 新鲜直达" })
  @IsOptional()
  @IsString()
  subtitle?: string;

  /** 商品主图地址。 */
  @ApiProperty({ description: "商品主图地址" })
  @IsString()
  @MinLength(1)
  imageUrl!: string;

  /** 富文本或纯文本商品详情。 */
  @ApiPropertyOptional({ description: "富文本或纯文本商品详情" })
  @IsOptional()
  @IsString()
  description?: string;

  /** 商品是否对用户可见。 */
  @ApiPropertyOptional({ description: "商品是否对用户可见", default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  /** 随商品一起创建或更新的 SKU 记录。 */
  @ApiPropertyOptional({ description: "随商品一起创建或更新的 SKU 记录", type: [UpsertSkuDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertSkuDto)
  skus?: UpsertSkuDto[];
}
