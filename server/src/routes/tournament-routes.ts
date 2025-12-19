import { ServerRoute } from '@hapi/hapi';

export const tournamentRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/tournament',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'TournamentController.createTournament',
    },
    {
        method: 'GET',
        path: '/tournaments',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'TournamentController.getTournaments',
    },
    {
        method: 'GET',
        path: '/tournaments/{id}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'TournamentController.getTournamentById',
    },
    {
        method: 'DELETE',
        path: '/tournaments/{id}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'TournamentController.deleteTournamentById',
    },
    {
        method: 'POST',
        path: '/join/tournament/{id}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'TournamentController.joinTournamentById',
    },
    {
        method: 'PATCH',
        path: '/tournament/{id}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'TournamentController.patchTournamentById',
    },
];
