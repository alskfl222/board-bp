/*
  Warnings:

  - You are about to drop the column `userId` on the `EmoticonList` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `EmoticonList` DROP FOREIGN KEY `EmoticonList_userId_fkey`;

-- AlterTable
ALTER TABLE `EmoticonList` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `UserEmoticon` (
    `userId` INTEGER NOT NULL,
    `listId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `listId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserEmoticon` ADD CONSTRAINT `UserEmoticon_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEmoticon` ADD CONSTRAINT `UserEmoticon_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `EmoticonList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
