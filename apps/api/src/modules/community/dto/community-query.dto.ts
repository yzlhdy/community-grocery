import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBooleanString, IsOptional, IsString } from "class-validator";
import { PageQueryDto } from "../../../common/dto/page-query.dto";

/**
 * 后台小区分页查询参数。
 */
export class CommunityQueryDto extends PageQueryDto {
  /** 小区名称关键词。 */
  @ApiPropertyOptional({ description: "小区名称关键词" })
  @IsOptional()
  @IsString()
  keyword?: string;

  /** 是否启用。 */
  @ApiPropertyOptional({ description: "是否启用", enum: ["true", "false"] })
  @IsOptional()
  @IsBooleanString()
  enabled?: string;
}
