/*
  Warnings:

  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavoriteRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Recipe` DROP FOREIGN KEY `Recipe_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `RecipeRating` DROP FOREIGN KEY `RecipeRating_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `RecipeRating` DROP FOREIGN KEY `RecipeRating_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserFavoriteRecipe` DROP FOREIGN KEY `UserFavoriteRecipe_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `UserFavoriteRecipe` DROP FOREIGN KEY `UserFavoriteRecipe_userId_fkey`;

-- DropTable
DROP TABLE `Recipe`;

-- DropTable
DROP TABLE `RecipeRating`;

-- DropTable
DROP TABLE `UserFavoriteRecipe`;
