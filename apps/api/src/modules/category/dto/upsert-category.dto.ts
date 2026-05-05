import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

/**
 * 创建或更新分类的参数。
 */
export class UpsertCategoryDto {
  /** 已存在的分类 ID，不传则创建新分类。 */
  @ApiPropertyOptional({ description: "已存在的分类 ID，不传则创建新分类" })
  @IsOptional()
  @IsString()
  id?: string;

  /** 分类展示名称。 */
  @ApiProperty({ description: "分类展示名称", example: "新鲜蔬菜" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** 子分类所属的父分类 ID。 */
  @ApiPropertyOptional({ description: "子分类所属的父分类 ID", nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string | null;

  /** 分类层级。 */
  @ApiProperty({ description: "分类层级", minimum: 1, example: 1 })
  @IsInt()
  @Min(1)
  level!: number;

  /** 分类图标地址。 */
  @ApiPropertyOptional({ description: "分类图标地址" })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  /** 排序权重，数值越小越靠前。 */
  @ApiPropertyOptional({ description: "排序权重，数值越小越靠前", default: 0 })
  @IsOptional()
  @IsInt()
  sort?: number;

  /** 分类是否可见。 */
  @ApiPropertyOptional({ description: "分类是否可见", default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
