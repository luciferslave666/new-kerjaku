-- AlterTable
ALTER TABLE `User` ADD COLUMN `otp_code` VARCHAR(191) NULL,
    ADD COLUMN `otp_expires_at` DATETIME(3) NULL;
