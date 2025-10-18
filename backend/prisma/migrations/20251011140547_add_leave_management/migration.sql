/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session` ADD COLUMN `lastActivityAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `leave_types` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT true,
    `requiresApproval` BOOLEAN NOT NULL DEFAULT true,
    `maxDaysPerRequest` INTEGER NULL,
    `color` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `leave_types_code_key`(`code`),
    INDEX `leave_types_code_idx`(`code`),
    INDEX `leave_types_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_balances` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `leaveTypeId` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `totalDays` DECIMAL(5, 1) NOT NULL,
    `usedDays` DECIMAL(5, 1) NOT NULL DEFAULT 0,
    `remainingDays` DECIMAL(5, 1) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leave_balances_employeeId_idx`(`employeeId`),
    INDEX `leave_balances_leaveTypeId_idx`(`leaveTypeId`),
    INDEX `leave_balances_year_idx`(`year`),
    UNIQUE INDEX `leave_balances_employeeId_leaveTypeId_year_key`(`employeeId`, `leaveTypeId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_requests` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `leaveTypeId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `totalDays` DECIMAL(4, 1) NOT NULL,
    `reason` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leave_requests_employeeId_idx`(`employeeId`),
    INDEX `leave_requests_leaveTypeId_idx`(`leaveTypeId`),
    INDEX `leave_requests_status_idx`(`status`),
    INDEX `leave_requests_startDate_idx`(`startDate`),
    INDEX `leave_requests_endDate_idx`(`endDate`),
    INDEX `leave_requests_reviewedBy_idx`(`reviewedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `leave_balances` ADD CONSTRAINT `leave_balances_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_balances` ADD CONSTRAINT `leave_balances_leaveTypeId_fkey` FOREIGN KEY (`leaveTypeId`) REFERENCES `leave_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_leaveTypeId_fkey` FOREIGN KEY (`leaveTypeId`) REFERENCES `leave_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_reviewedBy_fkey` FOREIGN KEY (`reviewedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
