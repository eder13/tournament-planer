import { Player } from '@prisma/client';
import Database from '../../db/prisma';
import TournamentHelper from '../../helpers/tournament';

export class TournamentService {
    static async advanceRound({
        tournamentId,
        players,
        nextRoundNumber,
    }: {
        tournamentId: string;
        players: Player[];
        nextRoundNumber: number;
    }) {
        // generate players with bye and without bye
        const playerCount = players.length;
        const targetSize =
            TournamentHelper.getNextPowerOfTwoForTournamentTable(playerCount);
        const byeCount = targetSize - playerCount;
        const shuffled = TournamentHelper.shuffle(players);
        const byePlayers = shuffled.slice(0, byeCount);
        const activePlayers = shuffled.slice(byeCount);

        // generate the round
        const round = await Database.getInstance().round.create({
            data: {
                tournament_id: tournamentId,
                round_number: nextRoundNumber,
            },
        });

        // generate the matches for the rounds
        // BYE Players that advance automatically
        for (const p of byePlayers) {
            await Database.getInstance().match.create({
                data: {
                    round_id: round.id,
                    player1_id: p.id,
                    player2_id: null,
                    winner_id: p.id,
                },
            });

            await Database.getInstance().player_Tournament.update({
                where: { id: p.id },
                data: { bye_count: { increment: 1 } },
            });
        }

        // generate normal players that need to fight
        for (let i = 0; i < activePlayers.length; i += 2) {
            await Database.getInstance().match.create({
                data: {
                    round_id: round.id,
                    player1_id: activePlayers[i].id,
                    player2_id: activePlayers[i + 1].id,
                },
            });
        }
    }
}
