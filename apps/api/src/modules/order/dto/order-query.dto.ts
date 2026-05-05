import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { PageQueryDto } from "../../../common/dto/page-query.dto";
import { OrderStatus } from "../../../generated/prisma/client";

/**
 * 订单列表查询参数。
 */
export class OrderQueryDto extends PageQueryDto {
  /** 可选订单状态过滤。 */
  @ApiPropertyOptional({ description: "订单状态", enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
