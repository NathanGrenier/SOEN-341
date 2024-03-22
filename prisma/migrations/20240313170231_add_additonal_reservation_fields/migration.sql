/*
  Warnings:

  - You are about to drop the column `checkInNotes` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `creditCardCVV` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditCardExpiry` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditCardNumber` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD_ON_FILE', 'CASH');

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "checkInNotes",
ADD COLUMN     "amountPaid" INTEGER,
ADD COLUMN     "checkInReportedDamages" TEXT,
ADD COLUMN     "creditCardCVV" TEXT NOT NULL,
ADD COLUMN     "creditCardExpiry" TEXT NOT NULL,
ADD COLUMN     "creditCardNumber" TEXT NOT NULL,
ADD COLUMN     "depositAmountRefunded" INTEGER,
ADD COLUMN     "depositAmountTaken" INTEGER,
ADD COLUMN     "paymentMethod" "PaymentMethod";
