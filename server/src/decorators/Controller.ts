import { Request } from '@hapi/hapi';
import Logger from '../helpers/logger';

export function Controller() {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        const methodNames = Object.getOwnPropertyNames(
            constructor.prototype
        ).filter(
            (name) =>
                name !== 'constructor' &&
                typeof constructor.prototype[name] === 'function'
        );

        for (const methodName of methodNames) {
            const originalMethod = constructor.prototype[methodName];

            constructor.prototype[methodName] = function (...args: any[]) {
                const req: Request | undefined = args[0];

                if (req?.method && req?.url) {
                    Logger.debug(
                        `${constructor.name}.${methodName} - method=${req.method} path=${req.url}`
                    );
                }

                return originalMethod.apply(this, args);
            };
        }
    };
}
