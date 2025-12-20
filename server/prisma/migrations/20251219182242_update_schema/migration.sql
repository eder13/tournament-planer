-- AlterTable
ALTER TABLE `Player_Tournament` ADD COLUMN `bye_count` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Round` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournament_id` VARCHAR(191) NOT NULL,
    `round_number` INTEGER NOT NULL,

    UNIQUE INDEX `Round_tournament_id_round_number_key`(`tournament_id`, `round_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `player1_id` INTEGER NOT NULL,
    `player2_id` INTEGER NULL,
    `winner_id` INTEGER NULL,
    `result` JSON NULL,

    INDEX `Match_round_id_idx`(`round_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Round` ADD CONSTRAINT `Round_tournament_id_fkey` FOREIGN KEY (`tournament_id`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Round`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_player1_id_fkey` FOREIGN KEY (`player1_id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_player2_id_fkey` FOREIGN KEY (`player2_id`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
