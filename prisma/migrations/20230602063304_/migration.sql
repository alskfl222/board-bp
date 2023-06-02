/*
  Warnings:

  - Added the required column `name` to the `Emoticon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Emoticon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Emoticon` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL;
