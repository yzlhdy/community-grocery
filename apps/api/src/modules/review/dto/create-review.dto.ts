import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

/**
 * 创建商品评价参数。
 */
export class CreateReviewDto {
  /** 订单商品 ID。 */
  @ApiProperty({ description: "订单商品 ID" })
  @IsString()
  @MinLength(1)
  orderItemId!: string;

  /** 评分，1 到 5 分。 */
  @ApiProperty({ description: "评分，1 到 5 分", minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  /** 评价内容。 */
  @ApiPropertyOptional({ description: "评价内容" })
  @IsOptional()
  @IsString()
  content?: string;

  /** 评价图片地址列表。 */
  @ApiPropertyOptional({ description: "评价图片地址列表", type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(9)
  imageUrls?: string[];

  /** 是否匿名评价。 */
  @ApiPropertyOptional({ description: "是否匿名评价", default: false })
  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;
}
