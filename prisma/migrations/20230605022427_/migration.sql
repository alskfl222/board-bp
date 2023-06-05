/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `boardId`);

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `hate` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `like` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `hate` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `like` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `view` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `UserHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `boardId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserHistory` ADD CONSTRAINT `UserHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHistory` ADD CONSTRAINT `UserHistory_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
