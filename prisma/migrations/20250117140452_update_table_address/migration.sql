/*
  Warnings:

  - You are about to drop the column `street_number` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `streetNumber` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "street_number",
DROP COLUMN "user_id",
ADD COLUMN     "streetNumber" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
