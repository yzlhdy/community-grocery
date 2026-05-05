import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { PageQueryDto } from "../../../common/dto/page-query.dto";
import { CustomerCouponStatus } from "../../../generated/prisma/client";

/**
 * 我的优惠券分页查询参数。
 */
export class CouponQueryDto extends PageQueryDto {
  /** 优惠券状态。 */
  @ApiPropertyOptional({ description: "优惠券状态", enum: CustomerCouponStatus })
  @IsOptional()
  @IsEnum(CustomerCouponStatus)
  status?: CustomerCouponStatus;
}
