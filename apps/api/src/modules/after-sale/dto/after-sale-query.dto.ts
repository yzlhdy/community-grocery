import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { PageQueryDto } from "../../../common/dto/page-query.dto";
import { AfterSaleStatus } from "../../../generated/prisma/client";

/**
 * 售后单分页查询参数。
 */
export class AfterSaleQueryDto extends PageQueryDto {
  /** 售后状态。 */
  @ApiPropertyOptional({ description: "售后状态", enum: AfterSaleStatus })
  @IsOptional()
  @IsEnum(AfterSaleStatus)
  status?: AfterSaleStatus;
}
