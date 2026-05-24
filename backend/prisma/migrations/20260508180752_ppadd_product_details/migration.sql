-- AlterTable
ALTER TABLE `product` ADD COLUMN `benefits` LONGTEXT NULL,
    ADD COLUMN `ingredients` TEXT NULL,
    ADD COLUMN `rating` VARCHAR(191) NULL,
    ADD COLUMN `reviewCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `usage` TEXT NULL;
