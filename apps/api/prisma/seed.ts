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
      leaderName: "李团长",
      leaderAvatarUrl: "/uploads/seed/leader.png",
      servicePhone: "13800000000",
      serviceTimeRange: "08:00-22:00",
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

  const seededCategories = [
    { id: "seed-category-fruit", name: "时令水果", level: 1, sort: 2 },
    { id: "seed-category-meat", name: "肉禽蛋品", level: 1, sort: 3 },
    { id: "seed-category-seafood", name: "海鲜水产", level: 1, sort: 4 },
    { id: "seed-category-dairy", name: "乳品烘焙", level: 1, sort: 5 },
    { id: "seed-category-snack", name: "休闲零食", level: 1, sort: 6 },
    { id: "seed-category-grocery", name: "粮油调味", level: 1, sort: 7 },
    { id: "seed-category-daily", name: "日用百货", level: 1, sort: 8 },
  ];

  for (const category of seededCategories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  const products = [
    {
      id: "seed-product-tomato",
      categoryId: "seed-category-vegetable",
      name: "圣女果",
      subtitle: "新鲜多汁 酸甜可口",
      imageUrl: "/uploads/seed/tomato.png",
      sales: 36500,
      badge: "5折",
      sku: { id: "seed-sku-tomato-500g", name: "500g", unit: "份", price: "4.99", marketPrice: "9.99", stock: 800 },
    },
    {
      id: "seed-product-egg",
      categoryId: "seed-category-meat",
      name: "鲜鸡蛋",
      subtitle: "柴鸡蛋 新鲜到家",
      imageUrl: "/uploads/seed/egg.png",
      sales: 18200,
      badge: "5.8折",
      sku: { id: "seed-sku-egg-10", name: "10枚", unit: "盒", price: "4.99", marketPrice: "8.60", stock: 500 },
    },
    {
      id: "seed-product-shrimp",
      categoryId: "seed-category-seafood",
      name: "南美白虾",
      subtitle: "鲜活冷冻 肉质紧实",
      imageUrl: "/uploads/seed/shrimp.png",
      sales: 9200,
      badge: "6.5折",
      sku: { id: "seed-sku-shrimp-300g", name: "300g", unit: "盒", price: "16.90", marketPrice: "25.90", stock: 300 },
    },
    {
      id: "seed-product-blueberry",
      categoryId: "seed-category-fruit",
      name: "蓝莓",
      subtitle: "新鲜甜美 酸甜可口",
      imageUrl: "/uploads/seed/blueberry.png",
      sales: 15600,
      badge: "当季热卖",
      sku: { id: "seed-sku-blueberry-125g", name: "125g", unit: "盒", price: "9.90", marketPrice: "12.90", stock: 300 },
    },
    {
      id: "seed-product-banana",
      categoryId: "seed-category-fruit",
      name: "香蕉",
      subtitle: "香甜软糯 营养丰富",
      imageUrl: "/uploads/seed/banana.png",
      sales: 22100,
      badge: "热销",
      sku: { id: "seed-sku-banana-1500g", name: "1.5kg", unit: "份", price: "6.90", marketPrice: "8.90", stock: 600 },
    },
    {
      id: "seed-product-apple",
      categoryId: "seed-category-fruit",
      name: "红富士苹果",
      subtitle: "脆甜多汁 新鲜直达",
      imageUrl: "/uploads/seed/apple.png",
      sales: 19800,
      badge: "脆甜多汁",
      sku: { id: "seed-sku-apple-2500g", name: "2.5kg", unit: "份", price: "19.90", marketPrice: "25.90", stock: 400 },
    },
  ];

  for (const item of products) {
    const seededProduct = await prisma.product.upsert({
      where: { id: item.id },
      update: {
        categoryId: item.categoryId,
        name: item.name,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl,
        sales: item.sales,
        badge: item.badge,
      },
      create: {
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl,
        sales: item.sales,
        badge: item.badge,
      },
    });

    await prisma.sku.upsert({
      where: { id: item.sku.id },
      update: {
        productId: seededProduct.id,
        name: item.sku.name,
        unit: item.sku.unit,
        price: item.sku.price,
        marketPrice: item.sku.marketPrice,
        stock: item.sku.stock,
      },
      create: {
        id: item.sku.id,
        productId: seededProduct.id,
        name: item.sku.name,
        unit: item.sku.unit,
        price: item.sku.price,
        marketPrice: item.sku.marketPrice,
        stock: item.sku.stock,
      },
    });
  }

  await prisma.homeBanner.upsert({
    where: { id: "seed-banner-home-top" },
    update: {},
    create: {
      id: "seed-banner-home-top",
      scene: "HOME_TOP",
      title: "今日生鲜特惠",
      subtitle: "时令好物 限时抢购",
      imageUrl: "/uploads/seed/banner-fresh.png",
      linkType: "campaign",
      linkValue: "seed-campaign-seckill",
      sort: 1,
    },
  });

  const seckill = await prisma.promotionCampaign.upsert({
    where: { id: "seed-campaign-seckill" },
    update: {},
    create: {
      id: "seed-campaign-seckill",
      type: "SECKILL",
      title: "今日秒杀",
      subtitle: "时令好物 限时抢购",
      badge: "限时直降",
      sort: 1,
    },
  });

  const recommend = await prisma.promotionCampaign.upsert({
    where: { id: "seed-campaign-recommend" },
    update: {},
    create: {
      id: "seed-campaign-recommend",
      type: "RECOMMEND",
      title: "人气推荐",
      subtitle: "大家都在买",
      sort: 2,
    },
  });

  for (const [index, item] of [
    ["seed-product-tomato", "seed-sku-tomato-500g", "4.99", "5折"],
    ["seed-product-shanghai-green", "seed-sku-shanghai-green-500g", "2.39", "6折"],
    ["seed-product-egg", "seed-sku-egg-10", "4.99", "5.8折"],
    ["seed-product-shrimp", "seed-sku-shrimp-300g", "16.90", "6.5折"],
  ].entries()) {
    await prisma.promotionProduct.upsert({
      where: {
        campaignId_productId_skuId: {
          campaignId: seckill.id,
          productId: item[0],
          skuId: item[1],
        },
      },
      update: {},
      create: {
        campaignId: seckill.id,
        productId: item[0],
        skuId: item[1],
        promoPrice: item[2],
        discountLabel: item[3],
        sort: index + 1,
      },
    });
  }

  for (const [index, item] of [
    ["seed-product-blueberry", "seed-sku-blueberry-125g"],
    ["seed-product-banana", "seed-sku-banana-1500g"],
    ["seed-product-apple", "seed-sku-apple-2500g"],
  ].entries()) {
    await prisma.promotionProduct.upsert({
      where: {
        campaignId_productId_skuId: {
          campaignId: recommend.id,
          productId: item[0],
          skuId: item[1],
        },
      },
      update: {},
      create: {
        campaignId: recommend.id,
        productId: item[0],
        skuId: item[1],
        sort: index + 1,
      },
    });
  }

  await prisma.couponTemplate.upsert({
    where: { id: "seed-coupon-59-6" },
    update: {},
    create: {
      id: "seed-coupon-59-6",
      title: "满59减6元",
      description: "社区买菜通用券",
      thresholdAmount: "59",
      discountAmount: "6",
      totalStock: 10000,
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
