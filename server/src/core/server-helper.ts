import { Server, ServerRoute } from '@hapi/hapi';
import { type Module, type BaseController } from '../types/core';
import Logger from '../helpers/logger';

const serverControllers: BaseController[] = [];
const serverRoutes: ServerRoute[] = [];

export class ServerHelper {
    static registerRoutes(routes: ServerRoute[]) {
        Logger.info('Setting Routes...');
        serverRoutes.push(...routes);
    }

    static registerControllers(controllers: BaseController[]) {
        Logger.info('Setting Controllers...');
        serverControllers.push(...controllers);
    }

    static async registerPlugins(
        server: Server,
        plugins: Array<{
            plugin: any;
            options?: Record<string, unknown> | undefined;
        }>
    ) {
        Logger.info('Registering Plugins...');

        await Promise.all(
            plugins.map((el) => {
                server.register({ plugin: el.plugin, options: el.options });
            })
        );
    }

    static registerHandlers(server: Server) {
        Logger.info('Registering Handlers...');

        serverRoutes.forEach((route) => {
            if (typeof route.handler === 'string') {
                const controllerName = route.handler.split('.')[0];
                const controllerMethod = route.handler.split('.')[1];
                const correspondingController = serverControllers.find(
                    (a) => a.name === controllerName
                );

                if (correspondingController) {
                    if (controllerMethod in correspondingController) {
                        Logger.info(
                            `Registering ${route.handler} with method=${route.method} for endpoint=${route.path}`
                        );

                        server.route([
                            {
                                ...route,
                                // @ts-ignore
                                handler: correspondingController[
                                    controllerMethod
                                ].bind(correspondingController),
                            },
                        ]);
                    } else {
                        Logger.error(
                            `Could not find corresponding method handler '${controllerMethod}' for controller '${controllerName}'`
                        );
                        process.exit(1);
                    }
                } else {
                    Logger.error(
                        `Could not find controller for ${route.handler}`
                    );
                    process.exit(1);
                }
            } else {
                server.route(route);
            }
        });
    }

    static async registerModules(modules: Module[]) {
        Logger.info('Registering Modules...');

        await Promise.all(
            modules.map((module) => {
                Logger.info('Registering ' + module.name);
                module.init();
            })
        );
    }
}
