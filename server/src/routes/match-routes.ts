import { ServerRoute } from '@hapi/hapi';

export const matchRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/match/{tournamentId}/{roundId}/{matchId}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'MatchController.setWinnerByMatch',
    },
];
