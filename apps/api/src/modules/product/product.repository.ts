import { Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { resolvePagination } from "../../common/utils/pagination";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

/**
 * 商品数据访问层。
 */
@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 分页查询商品。
   */
  async findPage(query: ProductQueryDto) {
    const pagination = resolvePagination(query);
    const enabled = query.enabled === undefined ? true : query.enabled === "true";
    const where = {
      enabled,
      categoryId: query.categoryId,
      name: query.keyword ? { contains: query.keyword, mode: "insensitive" as const } : undefined,
    };
    const [list, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          skus: {
            where: { enabled: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: this.resolveOrderBy(query.sortBy),
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { list, total, ...pagination };
  }

  /**
   * 查询商品详情。
   */
  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        skus: true,
      },
    });
  }

  /**
   * 创建商品。
   */
  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: this.toCreateProductData(dto),
    });
  }

  /**
   * 更新商品。
   */
  update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: this.toUpdateProductData(dto),
    });
  }

  /**
   * 删除商品。
   */
  delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  /**
   * 创建 SKU。
   */
  createSku(productId: string, sku: NonNullable<CreateProductDto["skus"]>[number]) {
    const { id: _id, ...skuData } = sku;
    return this.prisma.sku.create({
      data: { ...skuData, productId },
    });
  }

  /**
   * 更新 SKU。
   */
  updateSku(id: string, productId: string, sku: NonNullable<CreateProductDto["skus"]>[number]) {
    const { id: _id, ...skuData } = sku;
    return this.prisma.sku.update({
      where: { id },
      data: { ...skuData, productId },
    });
  }

  /**
   * 将商品列表排序参数转换为 Prisma 排序条件。
   */
  private resolveOrderBy(sortBy: ProductQueryDto["sortBy"]) {
    if (sortBy === "sales") return [{ sales: "desc" as const }, { sort: "asc" as const }];
    if (sortBy === "newest") return [{ createdAt: "desc" as const }];
    return [{ sort: "asc" as const }, { createdAt: "desc" as const }];
  }

  /**
   * 将 DTO 转换为商品写入结构。
   */
  private toCreateProductData(dto: CreateProductDto): Prisma.ProductUncheckedCreateInput {
    return this.toProductData(dto) as Prisma.ProductUncheckedCreateInput;
  }

  /**
   * 将商品更新 DTO 转换为 Prisma 写入结构。
   */
  private toUpdateProductData(dto: UpdateProductDto): Prisma.ProductUncheckedUpdateInput {
    return this.toProductData(dto);
  }

  /**
   * 将商品 DTO 转换为基础写入结构。
   */
  private toProductData(dto: CreateProductDto | UpdateProductDto): Prisma.ProductUncheckedUpdateInput {
    return {
      categoryId: dto.categoryId,
      name: dto.name,
      subtitle: dto.subtitle,
      imageUrl: dto.imageUrl,
      description: dto.description,
      enabled: dto.enabled,
    };
  }
}
