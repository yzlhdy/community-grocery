import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBooleanString, IsOptional, IsString } from "class-validator";

/**
 * Query parameters for product list pages.
 */
export class ProductQueryDto {
  /** Optional category filter. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  /** Optional fuzzy product-name keyword. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  /** Optional enabled filter. Defaults to true. */
  @ApiPropertyOptional({ enum: ["true", "false"] })
  @IsOptional()
  @IsBooleanString()
  enabled?: string;
}
