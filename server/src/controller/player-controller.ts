import { Request, ResponseToolkit } from '@hapi/hapi';
import { Controller } from '../decorators/Controller';
import { BaseController } from '../types/core';
import { HttpCode } from '../constants/common';
import Database from '../db/prisma';
import Logger from '../helpers/logger';

@Controller()
export class PlayerController implements BaseController {
    name = 'PlayerController';

    async deletePlayerById(
        req: Request<{
            Params: {
                id: number;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { id = -1 } = req.params;

        if (id === -1) {
            return h.response().code(HttpCode.BAD_REQUEST);
        }

        try {
            const data = await Database.getInstance().player.delete({
                where: {
                    id: Number(id),
                },
            });

            if (!data) {
                return h.response().code(HttpCode.NOT_FOUND);
            }

            return h.response().code(HttpCode.NO_CONTENT);
        } catch (e: any) {
            Logger.error(e);
            return h.response().code(HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
