import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

/**
 * 通用分页查询参数。
 */
export class PageQueryDto {
  /** 当前页码，从 1 开始。 */
  @ApiPropertyOptional({ description: "当前页码，从 1 开始", minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /** 每页数量，最大 100。 */
  @ApiPropertyOptional({ description: "每页数量，最大 100", minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
