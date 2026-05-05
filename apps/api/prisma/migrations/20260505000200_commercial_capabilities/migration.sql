ALTER TYPE "AssetStorage" ADD VALUE IF NOT EXISTS 'MINIO';

CREATE TYPE "AfterSaleType" AS ENUM ('REFUND_ONLY', 'RETURN_REFUND');
CREATE TYPE "AfterSaleStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED', 'CANCELLED');
CREATE TYPE "NotificationType" AS ENUM ('ORDER', 'PAYMENT', 'AFTER_SALE', 'SYSTEM');
CREATE TYPE "PointsChangeType" AS ENUM ('ORDER_REWARD', 'REFUND_DEDUCT', 'MANUAL_ADJUST');

CREATE TABLE "AfterSale" (
  "id" TEXT NOT NULL,
  "afterSaleNo" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "type" "AfterSaleType" NOT NULL,
  "status" "AfterSaleStatus" NOT NULL DEFAULT 'PENDING',
  "reason" TEXT NOT NULL,
  "description" TEXT,
  "refundAmount" DECIMAL(10, 2) NOT NULL,
  "rejectReason" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "refundedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AfterSale_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AfterSaleItem" (
  "id" TEXT NOT NULL,
  "afterSaleId" TEXT NOT NULL,
  "orderItemId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "refundAmount" DECIMAL(10, 2) NOT NULL,
  CONSTRAINT "AfterSaleItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductReview" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "orderItemId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "skuId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "content" TEXT,
  "imageUrls" TEXT[],
  "anonymous" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "payload" JSONB,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PointsLedger" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "type" "PointsChangeType" NOT NULL,
  "points" INTEGER NOT NULL,
  "balance" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "orderId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PointsLedger_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AfterSale_afterSaleNo_key" ON "AfterSale"("afterSaleNo");
CREATE INDEX "AfterSale_customerId_status_idx" ON "AfterSale"("customerId", "status");
CREATE INDEX "AfterSale_orderId_idx" ON "AfterSale"("orderId");
CREATE INDEX "AfterSaleItem_afterSaleId_idx" ON "AfterSaleItem"("afterSaleId");
CREATE INDEX "AfterSaleItem_orderItemId_idx" ON "AfterSaleItem"("orderItemId");
CREATE UNIQUE INDEX "ProductReview_orderItemId_key" ON "ProductReview"("orderItemId");
CREATE INDEX "ProductReview_customerId_idx" ON "ProductReview"("customerId");
CREATE INDEX "ProductReview_productId_createdAt_idx" ON "ProductReview"("productId", "createdAt");
CREATE INDEX "Notification_customerId_readAt_idx" ON "Notification"("customerId", "readAt");
CREATE INDEX "Notification_customerId_createdAt_idx" ON "Notification"("customerId", "createdAt");
CREATE INDEX "PointsLedger_customerId_createdAt_idx" ON "PointsLedger"("customerId", "createdAt");

ALTER TABLE "AfterSale" ADD CONSTRAINT "AfterSale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AfterSale" ADD CONSTRAINT "AfterSale_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AfterSaleItem" ADD CONSTRAINT "AfterSaleItem_afterSaleId_fkey" FOREIGN KEY ("afterSaleId") REFERENCES "AfterSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AfterSaleItem" ADD CONSTRAINT "AfterSaleItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PointsLedger" ADD CONSTRAINT "PointsLedger_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
