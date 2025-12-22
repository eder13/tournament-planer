import { Request, Server } from '@hapi/hapi';
import { type Module } from '../types/core';
import HapiCookie from '@hapi/cookie';
import Database from '../db/prisma';

export class AuthModule implements Module {
    name = 'AuthModule';

    constructor(public server: Server) {}

    async init() {
        await this.registerPlugin();
        this.addStrategy('session', 'cookie');
    }

    private async registerPlugin() {
        await this.server.register(HapiCookie);
    }

    private addStrategy(name: string, cookie: string) {
        this.server.auth.strategy(name, cookie, {
            cookie: {
                name: 'sid-example',
                password:
                    process.env.COOKIE_SECRET ??
                    'CO4NRP1HMALxxCFnRZABFA7GOJtzU_gI',
                isSecure: process.env.ENV !== 'dev',
                isHttpOnly: true,
                path: '/',
            },

            redirectTo: '/signin',

            validate: this.validate,
        });

        this.server.auth.default('session');
    }

    private async validate(request: Request, session: { id: number }) {
        const account = await Database.getInstance().user.findUnique({
            where: {
                id: session.id,
            },
        });

        if (!account) {
            return { isValid: false };
        }

        return { isValid: true, credentials: account };
    }
}
