import { Request, ResponseToolkit } from '@hapi/hapi';
import { Controller } from '../decorators/Controller';
import { BaseController } from '../types/core';
import {
    HttpCode,
    HTTPMethod,
    SeparatorPlayerUUIDDatabaes,
} from '../constants/common';
import Database from '../db/prisma';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../helpers/logger';
import type { DataTournamentResultDetails } from '../../../client/src/types/common';
import { Prisma } from '@prisma/client';
import TournamentHelper from '../helpers/tournament';
import { ServerURLUtils } from '../helpers/url';
import { TournamentService } from '../services/tournament-service/tournament-service';

@Controller()
export class TournamentController implements BaseController {
    name = 'TournamentController';

    public async getTournaments(request: Request, h: ResponseToolkit) {
        const data = await Database.getInstance().tournament.findMany({
            where: {
                created_by: Number(request.auth.credentials.id),
            },
        });

        return h.response(data).code(HttpCode.OK);
    }

    public async createTournament(
        request: Request<{
            Payload: {
                name: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { name } = request.payload;

        if (!name) {
            return h.response().code(HttpCode.BAD_REQUEST);
        }

        await Database.getInstance().tournament.create({
            data: {
                id: uuidv4(),
                created_on: new Date(),
                created_by: Number(request.auth.credentials.id),
                name,
            },
        });

        return h.redirect('/userprofile?created=true');
    }

    public async getTournamentById(
        request: Request<{
            Params: {
                id: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { id = '' } = request.params;

        if (!id) {
            return h.response().code(HttpCode.BAD_REQUEST);
        }

        const data = await Database.getInstance().tournament.findUnique({
            where: {
                id,
            },
            include: {
                players: {
                    include: {
                        player: true,
                    },
                },
            },
        });

        if (!data) {
            return h.response().code(HttpCode.NOT_FOUND);
        }

        return h.response(data).code(HttpCode.OK);
    }

    public async deleteTournamentById(
        request: Request<{
            Params: {
                id: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { id = '' } = request.params;

        if (!id) {
            return h.response().code(HttpCode.BAD_REQUEST);
        }

        const data = await Database.getInstance().tournament.delete({
            where: {
                id,
            },
        });

        if (!data) {
            return h.response().code(HttpCode.NOT_FOUND);
        }

        return h.response().code(HttpCode.NO_CONTENT);
    }

    public async joinTournamentById(
        request: Request<{
            Payload: {
                name: string;
            };
            Params: {
                id: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { name = '' } = request.payload;
        const { id = '' } = request.params;

        const tournament = await Database.getInstance().tournament.findUnique({
            where: {
                id,
            },
        });

        if (tournament?.started) {
            return h.response(/*html*/ `
                <html>
                    <head>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        />
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    </head>
                    <body>
                        <div class="container mt-5">
                            <div class="alert alert-danger" role="alert">
                                The tournament did already start, you can no longer join or participate.
                            </div>
                            <button onclick="window.history.back();" class="btn btn-primary">Back</button>
                        </div>
                    </body>
                </html>`);
        }

        if (!name || !id || tournament?.started) {
            return h.response(/*html*/ `
                <html>
                    <head>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        />
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    </head>
                    <body>
                        <div class="container mt-5">
                            <div class="alert alert-danger" role="alert">
                                You did not specify a name or the name is already registered. Please try again by scanning the QR Code or entering the join URL in the browser.
                            </div>
                            <button onclick="window.history.back();" class="btn btn-primary">Back</button>
                        </div>
                    </body>
                </html>`);
        }

        const nameToSaveInDatabase =
            name + SeparatorPlayerUUIDDatabaes + uuidv4();
        Logger.info(
            `Saving Player=${nameToSaveInDatabase} into database and connecting to tournament with id=${id}`
        );

        await Database.getInstance().player.create({
            data: {
                name: nameToSaveInDatabase,
                tournaments: {
                    create: {
                        tournament: {
                            connect: { id },
                        },
                    },
                },
            },
        });

        return h.response(/*html*/ `
            <html>
                <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container mt-5">
                        <div class="alert alert-success" role="alert">
                            You have been added to the Tournament! Your name will be displayed in the Admin Panel shortly!
                            <br>
                            You can close this window now.
                        </div>
                    </div>
                </body>
            </html>`);
    }

    public async patchTournamentById(
        req: Request<{
            Payload: Omit<
                Partial<DataTournamentResultDetails>,
                'id' | 'created_by' | 'players'
            >;
            Params: {
                id: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { id } = req.params;
        const data: Prisma.TournamentUpdateInput = {};

        // only use simple Patches, Omitted once are relations and more complex to patch
        if (req.payload.name !== undefined) data.name = req.payload.name;
        if (req.payload.created_on !== undefined)
            data.created_on = req.payload.created_on;
        if (req.payload.created_on !== undefined)
            data.created_on = req.payload.created_on;
        if (req.payload.started !== undefined)
            data.started = !!req.payload.started;

        try {
            const updatedRecord =
                await Database.getInstance().tournament.update({
                    where: {
                        id,
                    },
                    data,
                });

            Logger.debug(`Updated Record: ${JSON.stringify(updatedRecord)}`);

            return h.response(updatedRecord).code(HttpCode.OK);
        } catch (e) {
            Logger.error(e);

            return h.response().code(HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    public async startTournamentById(
        req: Request<{
            Params: {
                id: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { id = '' } = req.params;

        const tournament = await Database.getInstance().tournament.findUnique({
            where: {
                id,
            },
        });

        if (tournament?.started) {
            // get Players and shuffle them
            const players = await Database.getInstance().player.findMany({
                where: {
                    tournaments: {
                        some: {
                            tournament_id: id,
                        },
                    },
                },
            });

            const round = 1;

            try {
                await TournamentService.advanceRound({
                    tournamentId: id,
                    players,
                    nextRoundNumber: round,
                });
            } catch (e) {
                Logger.error(e);
            }

            return h.response().code(HttpCode.OK);
        } else {
            return h.response().code(HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
