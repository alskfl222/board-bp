/*
  Warnings:

  - You are about to drop the column `hate` on the `CommentSentiment` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `CommentSentiment` table. All the data in the column will be lost.
  - You are about to drop the column `hate` on the `PostSentiment` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `PostSentiment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CommentSentiment` DROP COLUMN `hate`,
    DROP COLUMN `like`,
    ADD COLUMN `degree` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `PostSentiment` DROP COLUMN `hate`,
    DROP COLUMN `like`,
    ADD COLUMN `degree` INTEGER NOT NULL DEFAULT 0;
