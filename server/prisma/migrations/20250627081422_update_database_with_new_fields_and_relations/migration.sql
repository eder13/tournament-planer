-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `cookingDuration` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `preparation` JSON NOT NULL,
    ADD COLUMN `recipes` JSON NOT NULL;

-- CreateTable
CREATE TABLE `RecipeRating` (
    `userId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecipeRating` ADD CONSTRAINT `RecipeRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeRating` ADD CONSTRAINT `RecipeRating_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
