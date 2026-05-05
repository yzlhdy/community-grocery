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
 * Payload for creating or updating one SKU under a product.
 */
export class UpsertSkuDto {
  /** Existing SKU id. Omit to create a new SKU. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  /** SKU display name. */
  @ApiProperty({ example: "约500g" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** Unit label. */
  @ApiProperty({ example: "份" })
  @IsString()
  @MinLength(1)
  unit!: string;

  /** Sale price. */
  @ApiProperty({ minimum: 0, example: 4.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  /** Market price for strike-through display. */
  @ApiPropertyOptional({ minimum: 0, example: 6.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  marketPrice?: number;

  /** Physical stock. */
  @ApiProperty({ minimum: 0, example: 100 })
  @IsInt()
  @Min(0)
  stock!: number;

  /** Whether this SKU can be sold. */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

/**
 * Payload for creating or updating one product with optional SKU records.
 */
export class UpsertProductDto {
  /** Existing product id. Omit to create a new product. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  /** Parent category id. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  categoryId!: string;

  /** Product display name. */
  @ApiProperty({ example: "上海青" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** Product subtitle. */
  @ApiPropertyOptional({ example: "当日采摘 新鲜直达" })
  @IsOptional()
  @IsString()
  subtitle?: string;

  /** Main product image URL. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  imageUrl!: string;

  /** Rich text or plain text description. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  /** Whether this product is visible to customers. */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  /** SKU records to create or update with the product. */
  @ApiPropertyOptional({ type: [UpsertSkuDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertSkuDto)
  skus?: UpsertSkuDto[];
}
