import { type Request, type ResponseToolkit } from '@hapi/hapi';
import Logger from '../helpers/logger';
import Database from '../db/prisma';
import { HttpCode } from '../constants/common';

export function isOwner(check: {
    dataSet: string;
    dataPropertyOwnerCompare: string;
}) {
    return function (
        target: Object,
        memberName: string,
        descriptor: PropertyDescriptor
    ) {
        const normalChildFunction = descriptor.value;

        descriptor.value = async (...args: any[]) => {
            Logger.info(
                'isOwner - checking if user is allowed to alter resource with method: ' +
                    memberName
            );

            const request = args[0] as Request;
            const h = args[1] as ResponseToolkit;
            const { id } = request.params;

            // @ts-ignore
            const data = await Database.getInstance()[check.dataSet].findUnique(
                {
                    where: {
                        id: Number(id),
                    },
                }
            );

            if (
                !data ||
                data[check.dataPropertyOwnerCompare] !==
                    request.auth.credentials.id
            ) {
                Logger.error(
                    `method=${request.method} on ${request.url} is not allowed by user ${request.auth.credentials.email}`
                );
                return h.response({}).code(HttpCode.FORBIDDEN);
            } else {
                // @ts-ignore
                return normalChildFunction.apply(this, args);
            }
        };
    };
}
