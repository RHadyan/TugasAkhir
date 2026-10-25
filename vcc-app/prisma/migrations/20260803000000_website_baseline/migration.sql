-- CreateTable
CREATE TABLE `countries` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `flagImage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `countries_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country_translations` (
    `id` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `locale` ENUM('id', 'en') NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `country_translations_locale_idx`(`locale`),
    UNIQUE INDEX `country_translations_countryId_locale_key`(`countryId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `eligibleStudyPrograms` JSON NOT NULL,
    `objectives` JSON NOT NULL,
    `mainColor` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `timelineDescription` TEXT NULL,
    `timeline` JSON NOT NULL,
    `scholarshipDescription` TEXT NULL,
    `scholarships` JSON NOT NULL,
    `contactPersons` JSON NOT NULL,
    `customSections` JSON NOT NULL,
    `gallery` JSON NOT NULL,
    `socialMedia` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,

    INDEX `programs_countryId_idx`(`countryId`),
    INDEX `programs_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_translations` (
    `id` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,
    `locale` ENUM('id', 'en') NOT NULL,
    `title` VARCHAR(191) NULL,
    `shortDescription` TEXT NULL,
    `description` TEXT NULL,
    `timelineDescription` TEXT NULL,
    `scholarshipDescription` TEXT NULL,
    `objectives` JSON NOT NULL,
    `timeline` JSON NOT NULL,
    `scholarships` JSON NOT NULL,
    `customSections` JSON NOT NULL,
    `gallery` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `program_translations_locale_idx`(`locale`),
    UNIQUE INDEX `program_translations_programId_locale_key`(`programId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `country_translations` ADD CONSTRAINT `country_translations_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `programs` ADD CONSTRAINT `programs_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_translations` ADD CONSTRAINT `program_translations_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
