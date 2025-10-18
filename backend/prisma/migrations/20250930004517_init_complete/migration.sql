-- AlterTable
ALTER TABLE `employee` ADD COLUMN `cniExpiry` DATETIME(3) NULL,
    ADD COLUMN `cniNumber` VARCHAR(191) NULL,
    ADD COLUMN `departmentId` VARCHAR(191) NULL,
    ADD COLUMN `dependentsCount` INTEGER NULL DEFAULT 0,
    ADD COLUMN `ipmNumber` VARCHAR(191) NULL,
    ADD COLUMN `maidenName` VARCHAR(191) NULL,
    ADD COLUMN `nineaNumber` VARCHAR(191) NULL,
    ADD COLUMN `numberOfChildren` INTEGER NULL DEFAULT 0,
    ADD COLUMN `phoneSecondary` VARCHAR(191) NULL,
    ADD COLUMN `phoneWhatsApp` VARCHAR(191) NULL,
    ADD COLUMN `positionId` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `serviceId` VARCHAR(191) NULL,
    ADD COLUMN `siteId` VARCHAR(191) NULL,
    ADD COLUMN `teamId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Employee_siteId_idx` ON `Employee`(`siteId`);

-- CreateIndex
CREATE INDEX `Employee_departmentId_idx` ON `Employee`(`departmentId`);

-- CreateIndex
CREATE INDEX `Employee_cniNumber_idx` ON `Employee`(`cniNumber`);
