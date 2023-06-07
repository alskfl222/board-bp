-- CreateTable
CREATE TABLE `EmoticonComment` (
    `emoticonId` INTEGER NOT NULL,
    `commentId` INTEGER NOT NULL,

    PRIMARY KEY (`emoticonId`, `commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmoticonComment` ADD CONSTRAINT `EmoticonComment_emoticonId_fkey` FOREIGN KEY (`emoticonId`) REFERENCES `Emoticon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmoticonComment` ADD CONSTRAINT `EmoticonComment_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
