import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

/**
 * Payload for creating or updating one category.
 */
export class UpsertCategoryDto {
  /** Existing category id. Omit to create a new category. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  /** Category display name. */
  @ApiProperty({ example: "新鲜蔬菜" })
  @IsString()
  @MinLength(1)
  name!: string;

  /** Parent category id for child categories. */
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string | null;

  /** Category hierarchy level. */
  @ApiProperty({ minimum: 1, example: 1 })
  @IsInt()
  @Min(1)
  level!: number;

  /** Category icon URL. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iconUrl?: string;

  /** Sort weight, lower values appear first. */
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sort?: number;

  /** Whether this category is visible. */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
