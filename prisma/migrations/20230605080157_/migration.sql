/*
  Warnings:

  - You are about to drop the `UserHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserHistory` DROP FOREIGN KEY `UserHistory_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `UserHistory` DROP FOREIGN KEY `UserHistory_userId_fkey`;

-- DropTable
DROP TABLE `UserHistory`;
