import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "argon2";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hash(process.env.ADMIN_DEFAULT_PASSWORD ?? "admin123456");

  await prisma.adminUser.upsert({
    where: { username: process.env.ADMIN_DEFAULT_USERNAME ?? "admin" },
    update: {},
    create: {
      username: process.env.ADMIN_DEFAULT_USERNAME ?? "admin",
      passwordHash,
      name: "系统管理员",
      role: "ADMIN",
    },
  });

  const community = await prisma.community.upsert({
    where: { id: "seed-community-xingfuli" },
    update: {},
    create: {
      id: "seed-community-xingfuli",
      name: "幸福里小区",
      address: "幸福路 88 号",
    },
  });

  await prisma.pickupPoint.upsert({
    where: { id: "seed-pickup-east-gate" },
    update: {},
    create: {
      id: "seed-pickup-east-gate",
      communityId: community.id,
      name: "幸福里小区东门",
      address: "幸福里小区东门便利店旁",
      contactName: "团长",
      contactPhone: "13800000000",
      pickupTimeRange: "今日 18:00-21:00",
    },
  });

  const vegetable = await prisma.category.upsert({
    where: { id: "seed-category-vegetable" },
    update: {},
    create: {
      id: "seed-category-vegetable",
      name: "新鲜蔬菜",
      level: 1,
      sort: 1,
    },
  });

  const leaf = await prisma.category.upsert({
    where: { id: "seed-category-leaf" },
    update: {},
    create: {
      id: "seed-category-leaf",
      name: "叶菜类",
      parentId: vegetable.id,
      level: 2,
      sort: 1,
    },
  });

  const product = await prisma.product.upsert({
    where: { id: "seed-product-shanghai-green" },
    update: {},
    create: {
      id: "seed-product-shanghai-green",
      categoryId: leaf.id,
      name: "上海青",
      subtitle: "新鲜采摘",
      imageUrl: "/uploads/seed/shanghai-green.png",
      sales: 2346,
    },
  });

  await prisma.sku.upsert({
    where: { id: "seed-sku-shanghai-green-500g" },
    update: {},
    create: {
      id: "seed-sku-shanghai-green-500g",
      productId: product.id,
      name: "约500g",
      unit: "份",
      price: "2.49",
      marketPrice: "3.99",
      stock: 1000,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
