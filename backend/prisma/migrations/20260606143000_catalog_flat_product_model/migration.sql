-- CreateTable
CREATE TABLE `animaltype` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `AnimalType_key_key`(`key`),
    UNIQUE INDEX `AnimalType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productcategory` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ProductCategory_key_key`(`key`),
    UNIQUE INDEX `ProductCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `product`
    ADD COLUMN `catalogId` INTEGER NULL,
    ADD COLUMN `imagePaths` LONGTEXT NULL,
    ADD COLUMN `price` DECIMAL(10, 2) NULL,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `sourceFolder` VARCHAR(191) NULL,
    ADD COLUMN `animalTypeId` VARCHAR(191) NULL,
    ADD COLUMN `productCategoryId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_catalogId_key` ON `product`(`catalogId`);

-- CreateIndex
CREATE INDEX `Product_catalogId_idx` ON `product`(`catalogId`);

-- CreateIndex
CREATE INDEX `Product_animalTypeId_idx` ON `product`(`animalTypeId`);

-- CreateIndex
CREATE INDEX `Product_productCategoryId_idx` ON `product`(`productCategoryId`);

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_animalTypeId_fkey` FOREIGN KEY (`animalTypeId`) REFERENCES `animaltype`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_productCategoryId_fkey` FOREIGN KEY (`productCategoryId`) REFERENCES `productcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
