-- CreateTable
CREATE TABLE `sites` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL DEFAULT 'Sénégal',
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sites_code_key`(`code`),
    INDEX `sites_code_idx`(`code`),
    INDEX `sites_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `managerId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `departments_code_key`(`code`),
    INDEX `departments_siteId_idx`(`siteId`),
    INDEX `departments_code_idx`(`code`),
    INDEX `departments_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `managerId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_code_key`(`code`),
    INDEX `services_departmentId_idx`(`departmentId`),
    INDEX `services_code_idx`(`code`),
    INDEX `services_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `leaderId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `teams_code_key`(`code`),
    INDEX `teams_serviceId_idx`(`serviceId`),
    INDEX `teams_code_idx`(`code`),
    INDEX `teams_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `level` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `positions_code_key`(`code`),
    INDEX `positions_code_idx`(`code`),
    INDEX `positions_category_idx`(`category`),
    INDEX `positions_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Employee_serviceId_idx` ON `Employee`(`serviceId`);

-- CreateIndex
CREATE INDEX `Employee_teamId_idx` ON `Employee`(`teamId`);

-- CreateIndex
CREATE INDEX `Employee_positionId_idx` ON `Employee`(`positionId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `sites`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `sites`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
