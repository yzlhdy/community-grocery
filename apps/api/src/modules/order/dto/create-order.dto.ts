import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsInt, IsString, Min, MinLength, ValidateNested } from "class-validator";

/**
 * One SKU line requested when creating an order.
 */
export class CreateOrderItemDto {
  /** SKU identifier. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  skuId!: string;

  /** Purchase quantity. */
  @ApiProperty({ minimum: 1, example: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

/**
 * Payload for creating an unpaid self-pickup order.
 */
export class CreateOrderDto {
  /** Community where the order will be fulfilled. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  communityId!: string;

  /** Pickup point under the selected community. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  pickupPointId!: string;

  /** SKU lines included in this order. */
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
