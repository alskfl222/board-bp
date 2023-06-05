-- CreateTable
CREATE TABLE `Sentiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `sentiment` VARCHAR(191) NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `contentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sentiment` ADD CONSTRAINT `Sentiment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
