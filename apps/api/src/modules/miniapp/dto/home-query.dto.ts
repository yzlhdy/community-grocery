import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

/**
 * 小程序首页查询参数。
 */
export class HomeQueryDto {
  /** 当前选择的小区 ID。 */
  @ApiPropertyOptional({ description: "当前选择的小区 ID" })
  @IsOptional()
  @IsString()
  communityId?: string;
}
