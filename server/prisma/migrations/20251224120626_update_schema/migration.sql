/*
  Warnings:

  - Added the required column `used` to the `PasswordResetVerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PasswordResetVerificationToken` ADD COLUMN `used` BOOLEAN NOT NULL;
