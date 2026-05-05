import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpsertProductDto } from "./dto/upsert-product.dto";

@Injectable()
/**
 * Provides product listing, detail, and admin product/SKU upsert operations.
 */
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists enabled products with their enabled SKUs for customer browsing.
   */
  async findMany(query: ProductQueryDto) {
    const enabled = query.enabled === undefined ? true : query.enabled === "true";
    const products = await this.prisma.product.findMany({
      where: {
        enabled,
        categoryId: query.categoryId,
        name: query.keyword ? { contains: query.keyword, mode: "insensitive" } : undefined,
      },
      include: {
        category: true,
        skus: {
          where: { enabled: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    });

    return products.map((product) => ({
      ...product,
      skus: product.skus.map((sku) => ({
        ...sku,
        price: Number(sku.price),
        marketPrice: sku.marketPrice ? Number(sku.marketPrice) : null,
      })),
    }));
  }

  /**
   * Reads one product with category and all SKUs.
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        skus: true,
      },
    });

    if (!product) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "Product not found", HttpStatus.NOT_FOUND);
    }

    return {
      ...product,
      skus: product.skus.map((sku) => ({
        ...sku,
        price: Number(sku.price),
        marketPrice: sku.marketPrice ? Number(sku.marketPrice) : null,
      })),
    };
  }

  /**
   * Creates or updates a product and its SKU records.
   */
  async upsert(dto: UpsertProductDto) {
    const productData = {
      categoryId: dto.categoryId,
      name: dto.name,
      subtitle: dto.subtitle,
      imageUrl: dto.imageUrl,
      description: dto.description,
      enabled: dto.enabled ?? true,
    };

    const product = dto.id
      ? await this.prisma.product.update({ where: { id: dto.id }, data: productData })
      : await this.prisma.product.create({ data: productData });

    for (const sku of dto.skus ?? []) {
      const data = {
        productId: product.id,
        name: sku.name,
        unit: sku.unit,
        price: sku.price,
        marketPrice: sku.marketPrice,
        stock: sku.stock,
        enabled: sku.enabled ?? true,
      };

      if (sku.id) {
        await this.prisma.sku.update({ where: { id: sku.id }, data });
      } else {
        await this.prisma.sku.create({ data });
      }
    }

    return this.findOne(product.id);
  }
}
