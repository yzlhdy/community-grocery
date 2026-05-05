import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min, MinLength } from "class-validator";

/**
 * Payload for adding or replacing one SKU quantity in the cart.
 */
export class UpsertCartItemDto {
  /** SKU identifier. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  skuId!: string;

  /** Desired cart quantity. */
  @ApiProperty({ minimum: 1, example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
