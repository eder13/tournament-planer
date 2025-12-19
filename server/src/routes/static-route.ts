import { ServerRoute, ResponseToolkit } from '@hapi/hapi';
import path from 'path';
import fs from 'fs';

const distClientReactOutput = path.join(__dirname, '../../client/dist');
const uploadsDirectory = path.join(__dirname, '../uploads');

// this code serves the static output of react and its assets and allows to use client side routing properly
// when the server fetches react
export const staticRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/uploads/{param*}',
        handler: {
            directory: {
                path: uploadsDirectory,
                index: false,
                listing: false,
            },
        },
    },
    {
        method: 'GET',
        path: '/{param*}', // single catch-all route
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
