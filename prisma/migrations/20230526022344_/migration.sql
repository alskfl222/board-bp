/*
  Warnings:

  - You are about to drop the `BoardAdmin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boardId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BoardAdmin` DROP FOREIGN KEY `BoardAdmin_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `BoardAdmin` DROP FOREIGN KEY `BoardAdmin_boardId_fkey`;

-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `boardId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `BoardAdmin`;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
