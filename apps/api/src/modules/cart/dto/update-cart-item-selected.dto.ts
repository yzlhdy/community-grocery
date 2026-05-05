import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

/**
 * 修改购物车商品选中状态的参数。
 */
export class UpdateCartItemSelectedDto {
  /** 是否选中该购物车商品。 */
  @ApiProperty({ description: "是否选中该购物车商品" })
  @IsBoolean()
  selected!: boolean;
}
