import { ServerRoute, ResponseToolkit } from '@hapi/hapi';
import path from 'path';
import fs from 'fs';

const distClientReactOutput = path.join(__dirname, '../../client/dist');
const staticAssetsServerDirectory = path.join(__dirname, '../assets');

export const staticRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/staticassets/{param*}',
        handler: {
            directory: {
                path: staticAssetsServerDirectory,
                index: false,
                listing: false,
            },
        },
    },
    {
        // this code serves the static output of react and its assets and allows to use client side routing properly
        // when the server fetches react
        method: 'GET',
        path: '/{param*}',
        options: {
            auth: { mode: 'try' },
            files: {
                relativeTo: distClientReactOutput,
            },
        },
        handler: async (request, h: ResponseToolkit) => {
            const requestedPath = request.params.param || 'index.html';
            const fullPath = path.join(distClientReactOutput, requestedPath);

            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
                return h.file(requestedPath);
            }

            // fallback to index.html for client-side routes
            return h.file('index.html');
        },
    },
];
