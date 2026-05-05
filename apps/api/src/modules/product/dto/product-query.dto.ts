import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBooleanString, IsIn, IsOptional, IsString } from "class-validator";
import { PageQueryDto } from "../../../common/dto/page-query.dto";

/**
 * 商品列表查询参数。
 */
export class ProductQueryDto extends PageQueryDto {
  /** 可选分类过滤条件。 */
  @ApiPropertyOptional({ description: "分类 ID" })
  @IsOptional()
  @IsString()
  categoryId?: string;

  /** 可选商品名称模糊搜索关键词。 */
  @ApiPropertyOptional({ description: "商品名称模糊搜索关键词" })
  @IsOptional()
  @IsString()
  keyword?: string;

  /** 可选上下架过滤条件，默认只查已上架。 */
  @ApiPropertyOptional({ description: "上下架过滤条件，默认 true", enum: ["true", "false"] })
  @IsOptional()
  @IsBooleanString()
  enabled?: string;

  /** 可选排序方式。 */
  @ApiPropertyOptional({
    description: "排序方式",
    enum: ["comprehensive", "sales", "price_asc", "price_desc", "newest"],
  })
  @IsOptional()
  @IsIn(["comprehensive", "sales", "price_asc", "price_desc", "newest"])
  sortBy?: "comprehensive" | "sales" | "price_asc" | "price_desc" | "newest";
}
