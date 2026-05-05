import { OmitType } from "@nestjs/swagger";
import { UpsertCategoryDto } from "./upsert-category.dto";

/**
 * 创建分类参数。
 */
export class CreateCategoryDto extends OmitType(UpsertCategoryDto, ["id"] as const) {}
