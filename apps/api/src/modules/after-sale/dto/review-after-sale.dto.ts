import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

/**
 * 后台审核售后单参数。
 */
export class ReviewAfterSaleDto {
  /** 是否通过审核。 */
  @ApiProperty({ description: "是否通过审核" })
  @IsBoolean()
  approved!: boolean;

  /** 拒绝原因。 */
  @ApiPropertyOptional({ description: "拒绝原因" })
  @IsOptional()
  @IsString()
  rejectReason?: string;
}
