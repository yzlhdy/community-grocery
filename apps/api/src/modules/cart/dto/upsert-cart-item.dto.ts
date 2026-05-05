import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min, MinLength } from "class-validator";

/**
 * 新增或替换购物车 SKU 数量的参数。
 */
export class UpsertCartItemDto {
  /** SKU 标识。 */
  @ApiProperty({ description: "SKU 标识" })
  @IsString()
  @MinLength(1)
  skuId!: string;

  /** 购物车目标数量。 */
  @ApiProperty({ description: "购物车目标数量", minimum: 1, example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
