import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { createPageResult } from "../../common/utils/pagination";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { presentProduct } from "./product.presenter";
import { ProductRepository } from "./product.repository";

@Injectable()
/**
 * 提供商品列表、详情和后台商品/SKU 写入能力。
 */
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * 查询用于用户浏览的商品及其已启用 SKU。
   */
  async findMany(query: ProductQueryDto) {
    const page = await this.productRepository.findPage(query);
    const list = page.list.map((product) => presentProduct(product));

    if (query.sortBy === "price_asc" || query.sortBy === "price_desc") {
      list.sort((left, right) => {
        const leftPrice = left.skus[0]?.price ?? 0;
        const rightPrice = right.skus[0]?.price ?? 0;
        return query.sortBy === "price_asc" ? leftPrice - rightPrice : rightPrice - leftPrice;
      });
    }

    return createPageResult({ ...page, list });
  }

  /**
   * 查询单个商品，包含分类和全部 SKU。
   */
  async findOne(id: string, options?: { enabled?: boolean }) {
    const product = await this.productRepository.findOne(id, options?.enabled);

    if (!product) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "商品不存在", HttpStatus.NOT_FOUND);
    }

    return presentProduct(product);
  }

  /**
   * 创建商品及其 SKU 记录。
   */
  async create(dto: CreateProductDto) {
    const product = await this.productRepository.create({ ...dto, enabled: dto.enabled ?? true });

    for (const sku of dto.skus ?? []) {
      await this.productRepository.createSku(product.id, { ...sku, enabled: sku.enabled ?? true });
    }

    return this.findOne(product.id);
  }

  /**
   * 更新商品及其 SKU 记录。
   */
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.update(id, dto);

    for (const sku of dto.skus ?? []) {
      if (sku.id) {
        await this.productRepository.updateSku(sku.id, product.id, sku);
      } else {
        await this.productRepository.createSku(product.id, { ...sku, enabled: sku.enabled ?? true });
      }
    }

    return this.findOne(product.id);
  }

  /**
   * 删除商品。
   */
  async delete(id: string) {
    const product = await this.productRepository.delete(id);
    return {
      id: product.id,
      name: product.name,
      enabled: product.enabled,
      deletedAt: product.deletedAt,
    };
  }
}
