import { Request, ResponseToolkit } from '@hapi/hapi';
import { Controller } from '../decorators/Controller';
import { BaseController } from '../types/core';
import Database from '../db/prisma';
import { HttpCode } from '../constants/common';

@Controller()
export class MatchController implements BaseController {
    name = 'MatchController';

    public async setWinnerByMatch(
        req: Request<{
            Params: {
                tournamentId: string;
                roundId: string;
                matchId: string;
            };
            Payload: {
                result: {
                    player1: number;
                    player2: number;
                };
            };
        }>,
        h: ResponseToolkit
    ) {
        const { tournamentId, roundId, matchId } = req.params;
        const { result } = req.payload;

        const match = await Database.getInstance().match.findFirst({
            where: {
                id: Number(matchId),
                round: {
                    id: Number(roundId),
                    tournament_id: tournamentId,
                },
            },
            include: {
                player1: true,
                player2: true,
            },
        });

        if (!match) {
            return h
                .response({ error: 'Match not found' })
                .code(HttpCode.NOT_FOUND);
        }

        if (result.player1 === result.player2) {
            return h
                .response({
                    error: 'Draws are not allowed. Please specify a proper winner.',
                })
                .code(HttpCode.BAD_REQUEST);
        }

        const winnerId =
            result.player1 > result.player2
                ? match.player1_id
                : match.player2_id;

        if (winnerId === null) {
            return h.response({}).code(HttpCode.INTERNAL_SERVER_ERROR);
        }

        await Database.getInstance().match.update({
            where: {
                id: match.id,
            },
            data: {
                winner_id: winnerId,
                result: result,
            },
        });

        return h.response({}).code(HttpCode.OK);
    }
}
