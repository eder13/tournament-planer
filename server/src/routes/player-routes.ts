import { ServerRoute } from '@hapi/hapi';

export const playerRoutes: ServerRoute[] = [
    {
        method: 'DELETE',
        path: '/players/{id}',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: { cookie: { redirectTo: false } },
        },
        handler: 'PlayerController.deletePlayerById',
    },
];
