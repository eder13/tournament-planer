-- DropForeignKey
ALTER TABLE `Player_Tournament` DROP FOREIGN KEY `Player_Tournament_player_id_fkey`;

-- DropForeignKey
ALTER TABLE `Player_Tournament` DROP FOREIGN KEY `Player_Tournament_tournament_id_fkey`;

-- AddForeignKey
ALTER TABLE `Player_Tournament` ADD CONSTRAINT `Player_Tournament_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Player_Tournament` ADD CONSTRAINT `Player_Tournament_tournament_id_fkey` FOREIGN KEY (`tournament_id`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
