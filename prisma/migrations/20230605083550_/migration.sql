/*
  Warnings:

  - You are about to drop the column `hate` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `hate` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Sentiment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Sentiment` DROP FOREIGN KEY `Sentiment_userId_fkey`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `hate`,
    DROP COLUMN `like`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `hate`,
    DROP COLUMN `like`;

-- DropTable
DROP TABLE `Sentiment`;

-- CreateTable
CREATE TABLE `PostSentiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,
    `like` INTEGER NOT NULL DEFAULT 0,
    `hate` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentSentiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `commentId` INTEGER NOT NULL,
    `like` INTEGER NOT NULL DEFAULT 0,
    `hate` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostSentiment` ADD CONSTRAINT `PostSentiment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostSentiment` ADD CONSTRAINT `PostSentiment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentSentiment` ADD CONSTRAINT `CommentSentiment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentSentiment` ADD CONSTRAINT `CommentSentiment_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
