/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `lastActivityAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `session` table. All the data in the column will be lost.
  - Made the column `refreshToken` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropIndex
DROP INDEX `Session_expiresAt_idx` ON `session`;

-- DropIndex
DROP INDEX `Session_refreshToken_key` ON `session`;

-- DropIndex
DROP INDEX `Session_token_idx` ON `session`;

-- DropIndex
DROP INDEX `Session_token_key` ON `session`;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `ipAddress`,
    DROP COLUMN `lastActivityAt`,
    DROP COLUMN `userAgent`,
    MODIFY `token` VARCHAR(1000) NULL,
    MODIFY `refreshToken` VARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE INDEX `session_refreshToken_idx` ON `session`(`refreshToken`);

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_userId_idx` TO `session_userId_idx`;
