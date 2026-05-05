import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBooleanString, IsOptional, IsString } from "class-validator";
import { PageQueryDto } from "../../../common/dto/page-query.dto";

/**
 * 后台自提点分页查询参数。
 */
export class PickupPointQueryDto extends PageQueryDto {
  /** 所属小区 ID。 */
  @ApiPropertyOptional({ description: "所属小区 ID" })
  @IsOptional()
  @IsString()
  communityId?: string;

  /** 自提点名称关键词。 */
  @ApiPropertyOptional({ description: "自提点名称关键词" })
  @IsOptional()
  @IsString()
  keyword?: string;

  /** 是否启用。 */
  @ApiPropertyOptional({ description: "是否启用", enum: ["true", "false"] })
  @IsOptional()
  @IsBooleanString()
  enabled?: string;
}
