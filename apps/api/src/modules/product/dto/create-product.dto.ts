import { OmitType } from "@nestjs/swagger";
import { UpsertProductDto } from "./upsert-product.dto";

/**
 * 创建商品参数。
 */
export class CreateProductDto extends OmitType(UpsertProductDto, ["id"] as const) {}
