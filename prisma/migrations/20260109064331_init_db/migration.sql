-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PELAMAR', 'UMKM') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `jenis_kelamin` VARCHAR(191) NULL,
    `pendidikan_akhir` VARCHAR(191) NULL,
    `skill` TEXT NULL,
    `foto_profil` VARCHAR(191) NULL,
    `cv_file` VARCHAR(191) NULL,

    UNIQUE INDEX `Pelamar_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Umkm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nama_usaha` VARCHAR(191) NOT NULL,
    `pemilik` VARCHAR(191) NOT NULL,
    `alamat` TEXT NOT NULL,
    `deskripsi` TEXT NULL,
    `logo` VARCHAR(191) NULL,

    UNIQUE INDEX `Umkm_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lowongan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `umkmId` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `gaji` INTEGER NULL,
    `tipe_pekerjaan` VARCHAR(191) NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lamaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lowonganId` INTEGER NOT NULL,
    `pelamarId` INTEGER NOT NULL,
    `status` ENUM('APPLIED', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    `tanggal_lamar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pelamar` ADD CONSTRAINT `Pelamar_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Umkm` ADD CONSTRAINT `Umkm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lowongan` ADD CONSTRAINT `Lowongan_umkmId_fkey` FOREIGN KEY (`umkmId`) REFERENCES `Umkm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lamaran` ADD CONSTRAINT `Lamaran_lowonganId_fkey` FOREIGN KEY (`lowonganId`) REFERENCES `Lowongan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lamaran` ADD CONSTRAINT `Lamaran_pelamarId_fkey` FOREIGN KEY (`pelamarId`) REFERENCES `Pelamar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
