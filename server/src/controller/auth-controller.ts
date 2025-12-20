import { type ResponseToolkit, type Request } from '@hapi/hapi';
import { type BaseController } from '../types/core';
import bcrypt from 'bcryptjs';
import Database from '../db/prisma';
import { ContentType, HttpCode, HTTPMethod } from '../constants/common';
import JWTHelper from '../helpers/jwt';
import MailService from '../services/mail-services/mail-service';
import Logger from '../helpers/logger';
import { Controller } from '../decorators/Controller';
import { v4 as uuidv4 } from 'uuid';
import { ServerURLUtils } from '../helpers/url';

const HASH_SALT_ROUNDS = 10;

@Controller()
export class AuthController implements BaseController {
    public name = 'AuthController';
    private readonly mailService = new MailService();

    async login(
        request: Request<{
            Payload: {
                email: string | undefined;
                password: string | undefined;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { email, password } = request.payload;

        if (!email || !password) {
            return h
                .response({
                    message: 'Server Side Validation Failed.',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.UNAUTHORIZED);
        }

        const user = await Database.getInstance().user.findUnique({
            where: {
                email,
            },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            request.cookieAuth.set({ id: user.id });
            return h.redirect('/userprofile');
        }

        return h.redirect('/signin?username_password_error=true');
    }

    async forgot(
        request: Request<{
            Payload: {
                email: string | undefined;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { email } = request.payload;

        if (!email) {
            return h
                .response({
                    message: 'Server Side Validation Failed.',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.UNAUTHORIZED);
        }

        const user = await Database.getInstance().user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return h
                .response({
                    message: 'User could not be found',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.UNAUTHORIZED);
        }

        const emailTokenReset = await JWTHelper.generateJWTEmailReset(email);
        const url = new URL(`${ServerURLUtils.getHostName()}/change-password`);
        url.searchParams.set('token', emailTokenReset);

        try {
            await this.mailService.sentMail(
                email,
                'Password Reset',
                /*html*/ `
                    <h1>Reset Email</h1> 
                    <a href="${url}">Click Here To Reset Email</a> 
                    <br /> <br /> 
                    <small>You have 1 hour before this email expires</small>
                `
            );
        } catch (e) {
            if (e instanceof Error) {
                Logger.error(e.message);
            } else {
                Logger.error('Failed to sent Mail');
            }

            return h
                .redirect('/forgot-password?email_error_generating=true')
                .code(HttpCode.INTERNAL_SERVER_ERROR);
        }

        return h.redirect('/forgot-password?email_successfully_sent=true');
    }

    async changePassword(
        request: Request<{
            Query: {
                token: string | undefined;
            };
            Payload?: {
                password: string;
                confirmpassword: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { token } = request.query;

        if (!token) {
            return h
                .response({
                    message: 'Server Side Validation Failed.',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.UNAUTHORIZED);
        }

        const decodedTokenResult = await JWTHelper.verfyJWTSecretEmailReset(
            token
        );

        if (decodedTokenResult.success) {
            if (
                request.payload?.password &&
                request.payload?.confirmpassword &&
                request.method === HTTPMethod.POST
            ) {
                const user = await Database.getInstance().user.findUnique({
                    where: {
                        email: decodedTokenResult.email as string,
                    },
                });

                if (!user) {
                    return h
                        .response({
                            message: 'User does not exist.',
                        })
                        .type(ContentType.APPLICATION_JSON)
                        .code(HttpCode.UNAUTHORIZED);
                }

                await Database.getInstance().user.update({
                    where: { email: decodedTokenResult.email as string },
                    data: {
                        password: await bcrypt.hash(
                            request.payload.password,
                            HASH_SALT_ROUNDS
                        ),
                    },
                });

                return h.redirect(
                    '/forgot-password?password_successfully_reset=true'
                );
            }

            return h.response(/*html*/ `
                <html>
                    <head>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        />
                        <style>
                            form {
                                display: flex;
                                flex-flow: column nowrap;
                                max-width: 500px;
                            }
                        </style>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    </head>
                    <body>
                        <div class="container mt-5">
                            <form method="post" action="/change-password?token=${token}">
                                <h1 class="mb-5">Set New Password</h1>
                                <div class="mb-3">
                                    <label class="form-label" for="password">Password: </label>
                                    <input class="form-control" id="password" name="password" type="password">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="confirmpassword">Confirm Password: </label>
                                    <input class="form-control" id="confirmpassword" name="confirmpassword" type="password"/>
                                </div>
                                <div class="mb-3">
                                    <input class="btn btn-primary" value="Change Password" type="submit">
                                </div>
                            </form>
                        </div>
                    </body>
                </html>`);
        }

        return h
            .response({
                message:
                    'Password Reset Token already expired, please get a new one.',
            })
            .type(ContentType.APPLICATION_JSON)
            .code(HttpCode.UNAUTHORIZED);
    }

    user(request: Request, h: ResponseToolkit) {
        return h
            .response({
                id: request.auth.credentials.id,
                email: request.auth.credentials.email,
            })
            .code(HttpCode.OK)
            .type(ContentType.APPLICATION_JSON);
    }

    logout(request: Request, h: ResponseToolkit) {
        request.cookieAuth.clear();
        return h.redirect('/');
    }

    async register(
        request: Request<{
            Payload: {
                email: string | undefined;
                password: string | undefined;
                confirmPassword: string | undefined;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { email, password, confirmPassword } = request.payload;

        if (!email || !password || !confirmPassword) {
            return h
                .response({
                    message: 'Server Side Validation Failed.',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.BAD_REQUEST);
        }

        const user = await Database.getInstance().user.findUnique({
            where: {
                email,
            },
        });

        if (user !== null) {
            return h
                .response({
                    message: 'This E-Mail Already exists',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.BAD_REQUEST);
        }

        await Database.getInstance().user.create({
            data: {
                email,
                password: await bcrypt.hash(password, HASH_SALT_ROUNDS),
            },
        });

        const registeredUser = await Database.getInstance().user.findUnique({
            where: {
                email,
            },
        });

        request.cookieAuth.set({ id: registeredUser?.id });

        return h.redirect('/userprofile');
    }
}
