import { OmitType, PartialType } from "@nestjs/swagger";
import { UpsertProductDto } from "./upsert-product.dto";

/**
 * 更新商品参数。
 */
export class UpdateProductDto extends PartialType(OmitType(UpsertProductDto, ["id"] as const)) {}
