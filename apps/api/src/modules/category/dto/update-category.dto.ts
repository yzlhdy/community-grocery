import { PartialType, OmitType } from "@nestjs/swagger";
import { UpsertCategoryDto } from "./upsert-category.dto";

/**
 * 更新分类参数。
 */
export class UpdateCategoryDto extends PartialType(OmitType(UpsertCategoryDto, ["id"] as const)) {}
