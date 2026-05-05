import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";

/**
 * 创建订单时提交的一条 SKU 明细。
 */
export class CreateOrderItemDto {
  /** SKU 标识。 */
  @ApiProperty({ description: "SKU 标识" })
  @IsString()
  @MinLength(1)
  skuId!: string;

  /** 购买数量。 */
  @ApiProperty({ description: "购买数量", minimum: 1, example: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

/**
 * 创建未支付自提订单的参数。
 */
export class CreateOrderDto {
  /** 订单履约小区。 */
  @ApiProperty({ description: "订单履约小区 ID" })
  @IsString()
  @MinLength(1)
  communityId!: string;

  /** 所选小区下的自提点。 */
  @ApiProperty({ description: "所选小区下的自提点 ID" })
  @IsString()
  @MinLength(1)
  pickupPointId!: string;

  /** 订单包含的 SKU 明细。 */
  @ApiProperty({ description: "订单包含的 SKU 明细", type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  /** 使用的用户优惠券 ID。 */
  @ApiPropertyOptional({ description: "使用的用户优惠券 ID" })
  @IsOptional()
  @IsString()
  couponId?: string;
}
