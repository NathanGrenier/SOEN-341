-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "couponId" INTEGER;

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discountAmount" INTEGER,
    "discountBasisPoints" INTEGER,
    "validFrom" TIMESTAMP(3),
    "expires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_couponCode_key" ON "Coupon"("couponCode");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
