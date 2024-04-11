/*
  Warnings:

  - Added the required column `type` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('Sedan', 'SUV', 'Hatchback', 'Pickup', 'Supercar', 'Convertible', 'Minivan');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "type" "CarType" NOT NULL;

-- DropEnum
DROP TYPE "Size";
