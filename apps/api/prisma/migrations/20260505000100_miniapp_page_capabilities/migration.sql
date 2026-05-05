CREATE TYPE "BannerScene" AS ENUM ('HOME_TOP', 'HOME_PROMOTION');
CREATE TYPE "PromotionType" AS ENUM ('SECKILL', 'RECOMMEND');
CREATE TYPE "CouponType" AS ENUM ('FULL_REDUCTION');
CREATE TYPE "CustomerCouponStatus" AS ENUM ('AVAILABLE', 'USED', 'EXPIRED');

ALTER TABLE "Customer"
  ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "walletBalance" DECIMAL(10, 2) NOT NULL DEFAULT 0;

ALTER TABLE "PickupPoint"
  ADD COLUMN "leaderName" TEXT,
  ADD COLUMN "leaderAvatarUrl" TEXT,
  ADD COLUMN "servicePhone" TEXT,
  ADD COLUMN "serviceTimeRange" TEXT;

ALTER TABLE "Product"
  ADD COLUMN "badge" TEXT;

ALTER TABLE "CartItem"
  ADD COLUMN "selected" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "HomeBanner" (
  "id" TEXT NOT NULL,
  "scene" "BannerScene" NOT NULL DEFAULT 'HOME_TOP',
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "imageUrl" TEXT NOT NULL,
  "linkType" TEXT,
  "linkValue" TEXT,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HomeBanner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromotionCampaign" (
  "id" TEXT NOT NULL,
  "type" "PromotionType" NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "badge" TEXT,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PromotionCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromotionProduct" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "skuId" TEXT,
  "promoPrice" DECIMAL(10, 2),
  "discountLabel" TEXT,
  "sort" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "PromotionProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CouponTemplate" (
  "id" TEXT NOT NULL,
  "type" "CouponType" NOT NULL DEFAULT 'FULL_REDUCTION',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "thresholdAmount" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "discountAmount" DECIMAL(10, 2) NOT NULL,
  "totalStock" INTEGER,
  "receivedCount" INTEGER NOT NULL DEFAULT 0,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CouponTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomerCoupon" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "templateId" TEXT NOT NULL,
  "status" "CustomerCouponStatus" NOT NULL DEFAULT 'AVAILABLE',
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt" TIMESTAMP(3),
  "orderId" TEXT,
  CONSTRAINT "CustomerCoupon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomerAddress" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "province" TEXT,
  "city" TEXT,
  "district" TEXT,
  "detailAddress" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FavoriteProduct" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FavoriteProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BrowsingHistory" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BrowsingHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HomeBanner_scene_enabled_sort_idx" ON "HomeBanner"("scene", "enabled", "sort");
CREATE INDEX "PromotionCampaign_type_enabled_sort_idx" ON "PromotionCampaign"("type", "enabled", "sort");
CREATE UNIQUE INDEX "PromotionProduct_campaignId_productId_skuId_key" ON "PromotionProduct"("campaignId", "productId", "skuId");
CREATE INDEX "PromotionProduct_campaignId_sort_idx" ON "PromotionProduct"("campaignId", "sort");
CREATE INDEX "CouponTemplate_enabled_startsAt_endsAt_idx" ON "CouponTemplate"("enabled", "startsAt", "endsAt");
CREATE INDEX "CustomerCoupon_customerId_status_idx" ON "CustomerCoupon"("customerId", "status");
CREATE INDEX "CustomerCoupon_templateId_idx" ON "CustomerCoupon"("templateId");
CREATE INDEX "CustomerAddress_customerId_isDefault_idx" ON "CustomerAddress"("customerId", "isDefault");
CREATE UNIQUE INDEX "FavoriteProduct_customerId_productId_key" ON "FavoriteProduct"("customerId", "productId");
CREATE INDEX "FavoriteProduct_customerId_idx" ON "FavoriteProduct"("customerId");
CREATE INDEX "BrowsingHistory_customerId_createdAt_idx" ON "BrowsingHistory"("customerId", "createdAt");

ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PromotionCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CustomerCoupon" ADD CONSTRAINT "CustomerCoupon_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomerCoupon" ADD CONSTRAINT "CustomerCoupon_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CouponTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BrowsingHistory" ADD CONSTRAINT "BrowsingHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BrowsingHistory" ADD CONSTRAINT "BrowsingHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
