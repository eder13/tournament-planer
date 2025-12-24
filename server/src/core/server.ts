import Hapi from '@hapi/hapi';
import { ServerHelper } from './server-helper';
import Database from '../db/prisma';
import { AuthModule } from '../modules';
import Logger from '../helpers/logger';
import path from 'path';
import Inert from '@hapi/inert';
import Crumb from '@hapi/crumb';
import { tournamentRoutes } from '../routes/tournament-routes';
import { TournamentController } from '../controller/tournament-controller';
import { staticRoutes } from '../routes/static-route';
import { authRoutes } from '../routes/auth-routes';
import { AuthController } from '../controller/auth-controller';
import { PlayerController } from '../controller/player-controller';
import { playerRoutes } from '../routes/player-routes';
import { roundRoutes } from '../routes/round-routes';
import { RoundController } from '../controller/round-controller';
import { MatchController } from '../controller/match-controller';
import { matchRoutes } from '../routes/match-routes';

const port = process.env.PORT ?? 3100;

const server = new Hapi.Server({
    port: port,
    host: '0.0.0.0',
    routes: {
        files: {
            relativeTo: path.join(__dirname, '../../client/dist'),
        },
    },
});

(async () => {
    await ServerHelper.registerPlugins(server, [
        { plugin: Inert },
        {
            plugin: Crumb,
            options: {
                cookieOptions: {
                    isHttpOnly: false,
                    isSameSite: 'Lax',
                    isSecure: process.env.ENV !== 'dev',
                },
                logUnauthorized: true,
            },
        },
    ]);
    await ServerHelper.registerModules([new AuthModule(server)]);
    ServerHelper.registerRoutes([
        ...staticRoutes,
        ...authRoutes,
        ...tournamentRoutes,
        ...playerRoutes,
        ...roundRoutes,
        ...matchRoutes,
    ]);
    ServerHelper.registerControllers([
        new AuthController(),
        new TournamentController(),
        new PlayerController(),
        new RoundController(),
        new MatchController(),
    ]);
    ServerHelper.registerHandlers(server);

    server
        .start()
        .then(() => {
            Logger.info(`Server running at ${server.info.uri}...`);
        })
        .catch((e) => {
            Logger.error('Could not start server, reason: ' + e.message);
            Database.disconnect();
            process.exit(1);
        });
})();
