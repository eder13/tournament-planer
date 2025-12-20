import { Request, ResponseToolkit } from '@hapi/hapi';
import { HttpCode } from '../constants/common';
import Database from '../db/prisma';
import { Controller } from '../decorators/Controller';
import Logger from '../helpers/logger';
import { BaseController } from '../types/core';
import { Player } from '@prisma/client';
import { TournamentService } from '../services/tournament-service/tournament-service';

@Controller()
export class RoundController implements BaseController {
    name = 'RoundController';

    public async getRoundsAndMatchesByTournamentId(
        req: Request<{
            Params: {
                tournamentId: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { tournamentId = '' } = req.params;

        let tournamentWithRounds =
            await Database.getInstance().tournament.findUnique({
                where: { id: tournamentId },
                include: {
                    rounds: {
                        orderBy: {
                            round_number: 'asc',
                        },
                        include: {
                            matches: {
                                include: {
                                    player1: true,
                                    player2: true,
                                    winner: true,
                                },
                                orderBy: {
                                    id: 'asc',
                                },
                            },
                        },
                    },
                },
            });

        const currentActiveRound =
            tournamentWithRounds?.rounds[
                tournamentWithRounds.rounds.length - 1
            ];

        if (
            currentActiveRound?.matches.every((match) => match.winner !== null)
        ) {
            Logger.info(
                `Round=${currentActiveRound.round_number} with id=${currentActiveRound.id} of tournament=${currentActiveRound.tournament_id} is over. Advancing to next round.`
            );

            const winners = currentActiveRound.matches
                .map((match) => {
                    return match.winner;
                })
                .filter((winner) => {
                    return winner !== null;
                });

            if (winners.length > 1) {
                const nextRound = currentActiveRound.round_number + 1;

                Logger.info(
                    `Advancing to Round=${nextRound} with Winners=${JSON.stringify(
                        winners
                    )}`
                );

                await TournamentService.advanceRound({
                    tournamentId,
                    nextRoundNumber: nextRound,
                    players: winners,
                });

                tournamentWithRounds =
                    await Database.getInstance().tournament.findUnique({
                        where: { id: tournamentId },
                        include: {
                            rounds: {
                                orderBy: {
                                    round_number: 'asc',
                                },
                                include: {
                                    matches: {
                                        include: {
                                            player1: true,
                                            player2: true,
                                            winner: true,
                                        },
                                        orderBy: {
                                            id: 'asc',
                                        },
                                    },
                                },
                            },
                        },
                    });
            }
        }

        return h.response({ tournamentWithRounds }).code(HttpCode.OK);
    }

    public async advanceRoundAndMatchByTournamentId(
        req: Request<{
            Params: {
                tournamentId: string;
            };
            Payload: {
                players: Array<Player>;
                nextRoundNumber: number;
            };
        }>,
        h: ResponseToolkit
    ) {
        try {
            const { tournamentId = '' } = req.params;
            const { players = [], nextRoundNumber = 0 } = req.payload;

            await TournamentService.advanceRound({
                tournamentId,
                players,
                nextRoundNumber,
            });

            return h.response().code(HttpCode.CREATED);
        } catch (e) {
            Logger.error(e);
            return h.response().code(HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
