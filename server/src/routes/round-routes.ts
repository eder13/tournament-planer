import { ServerRoute } from '@hapi/hapi';

export const roundRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/rounds/matches/{tournamentId}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'RoundController.getRoundsAndMatchesByTournamentId',
    },
    {
        method: 'POST',
        path: '/round/advance/{tournamentId}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'RoundController.advanceRoundAndMatchByTournamentId',
    },
];
