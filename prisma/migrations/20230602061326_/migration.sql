-- CreateTable
CREATE TABLE `EmoticonList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `presented` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `EmoticonList_name_key`(`name`),
    UNIQUE INDEX `EmoticonList_presented_key`(`presented`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Emoticon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmoticonList` ADD CONSTRAINT `EmoticonList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emoticon` ADD CONSTRAINT `Emoticon_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `EmoticonList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
