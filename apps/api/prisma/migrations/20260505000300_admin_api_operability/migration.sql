ALTER TABLE "Community" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "PickupPoint" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Category" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Sku" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "CouponTemplate" ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE TABLE "AdminOperationLog" (
  "id" TEXT NOT NULL,
  "adminUserId" TEXT,
  "module" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "resourceId" TEXT,
  "summary" TEXT NOT NULL,
  "beforeData" JSONB,
  "afterData" JSONB,
  "ip" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminOperationLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminOperationLog_adminUserId_createdAt_idx" ON "AdminOperationLog"("adminUserId", "createdAt");
CREATE INDEX "AdminOperationLog_module_action_createdAt_idx" ON "AdminOperationLog"("module", "action", "createdAt");
CREATE INDEX "AdminOperationLog_resourceId_idx" ON "AdminOperationLog"("resourceId");

CREATE INDEX "Community_deletedAt_idx" ON "Community"("deletedAt");
CREATE INDEX "PickupPoint_deletedAt_idx" ON "PickupPoint"("deletedAt");
CREATE INDEX "Category_deletedAt_idx" ON "Category"("deletedAt");
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");
CREATE INDEX "Sku_deletedAt_idx" ON "Sku"("deletedAt");
CREATE INDEX "CouponTemplate_deletedAt_idx" ON "CouponTemplate"("deletedAt");

ALTER TABLE "AdminOperationLog" ADD CONSTRAINT "AdminOperationLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
