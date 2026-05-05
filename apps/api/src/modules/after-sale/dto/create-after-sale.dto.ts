import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { AfterSaleType } from "../../../generated/prisma/client";

/**
 * 售后申请商品明细。
 */
export class CreateAfterSaleItemDto {
  /** 订单商品 ID。 */
  @ApiProperty({ description: "订单商品 ID" })
  @IsString()
  @MinLength(1)
  orderItemId!: string;

  /** 申请售后数量。 */
  @ApiProperty({ description: "申请售后数量", minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

/**
 * 创建售后单参数。
 */
export class CreateAfterSaleDto {
  /** 订单 ID。 */
  @ApiProperty({ description: "订单 ID" })
  @IsString()
  @MinLength(1)
  orderId!: string;

  /** 售后类型。 */
  @ApiProperty({ description: "售后类型", enum: AfterSaleType })
  @IsEnum(AfterSaleType)
  type!: AfterSaleType;

  /** 售后原因。 */
  @ApiProperty({ description: "售后原因", example: "商品破损" })
  @IsString()
  @MinLength(1)
  reason!: string;

  /** 补充说明。 */
  @ApiPropertyOptional({ description: "补充说明" })
  @IsOptional()
  @IsString()
  description?: string;

  /** 售后商品明细。 */
  @ApiProperty({ description: "售后商品明细", type: [CreateAfterSaleItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAfterSaleItemDto)
  items!: CreateAfterSaleItemDto[];
}
