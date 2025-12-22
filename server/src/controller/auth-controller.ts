import { type ResponseToolkit, type Request } from '@hapi/hapi';
import { type BaseController } from '../types/core';
import bcrypt from 'bcryptjs';
import Database from '../db/prisma';
import { ContentType, HttpCode, HTTPMethod } from '../constants/common';
import JWTHelper from '../helpers/jwt';
import MailService from '../services/mail-services/mail-service';
import Logger from '../helpers/logger';
import { Controller } from '../decorators/Controller';
import { ServerURLUtils } from '../helpers/url';
import TokenHelper from '../helpers/token';

const HASH_SALT_ROUNDS = 10;

@Controller()
export class AuthController implements BaseController {
    public name = 'AuthController';
    private readonly mailService = new MailService();

    private async sendEmail(mail: string, token: string, h: ResponseToolkit) {
        const url = new URL(
            `${ServerURLUtils.getHostName()}/verifyuser/${token}`
        );

        try {
            await this.mailService.sendMail(
                mail,
                'Registration',
                /*html*/ `
                    <h1>Registration: Account Activation</h1> 
                    <a href="${url}">Click here to activate your account and finish your registration.</a> 
                    <br /> <br /> 
                    <small>You have 1 hour before this email expires.</small>
                `
            );
        } catch (e) {
            if (e instanceof Error) {
                Logger.error(e.message);
            } else {
                Logger.error('Failed to sent Mail for Registration.');
            }

            return h
                .redirect('/signup?email_error_generating=true')
                .code(HttpCode.INTERNAL_SERVER_ERROR);
        }

        return h.redirect('/signup?email_sent=true');
    }

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

        if (user && !user.emailVerified) {
            return h.redirect('/signin?account_not_activated=true');
        }

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
            await this.mailService.sendMail(
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
            where: { email },
            include: {
                verificationTokens: {
                    orderBy: { expiresAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (user !== null && user.emailVerified) {
            Logger.info(
                `User ${user.email} already registered and activated - duplicate E-Mail.`
            );

            return h.redirect('/signup?email_already_exists=true');
        }

        if (
            user !== null &&
            !user.emailVerified &&
            user.verificationTokens[0].token &&
            user.verificationTokens[0].expiresAt.getTime() < Date.now()
        ) {
            Logger.info(
                `User ${user.email} already registered but did not confirm account. Regenerating token.`
            );

            const registrationToken = TokenHelper.generateToken();
            const expires = TokenHelper.getTokenLifeTime1Hour();

            await Database.getInstance().verificationToken.updateMany({
                where: { userId: user.id },
                data: {
                    token: registrationToken,
                    expiresAt: expires,
                },
            });

            return this.sendEmail(email, registrationToken, h);
        }

        if (
            user !== null &&
            !user.emailVerified &&
            user.verificationTokens[0].token
        ) {
            return h.redirect(
                '/signup?account_not_activated_but_registered=true'
            );
        }

        const newRegisteredUser = await Database.getInstance().user.create({
            data: {
                email,
                password: await bcrypt.hash(password, HASH_SALT_ROUNDS),
            },
        });

        const registrationToken = TokenHelper.generateToken();
        const expires = TokenHelper.getTokenLifeTime1Hour();

        await Database.getInstance().verificationToken.create({
            data: {
                userId: newRegisteredUser.id,
                token: registrationToken,
                expiresAt: expires,
            },
        });

        return this.sendEmail(email, registrationToken, h);
    }

    async registerVerify(
        request: Request<{
            Params: {
                token: string;
            };
        }>,
        h: ResponseToolkit
    ) {
        const { token } = request.params;

        if (!token) {
            return h
                .response({
                    message: 'Server Side Validation Failed.',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.UNAUTHORIZED);
        }

        const verification =
            await Database.getInstance().verificationToken.findUnique({
                where: { token },
            });

        if (!verification || verification.expiresAt.getTime() < Date.now()) {
            return h.response(/*html*/ `
                <html>
                    <head>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        />
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    </head>
                    <body>
                        <div class="container mt-5">
                            <div class="alert alert-info" role="info">
                                Your E-Mail did already expire.
                                Your Account is not activated yet. Please confirm the
                                link from the confirmation mail. If the link expired,
                                you can get a new Link
                                <a href="/account/activate">
                                    here
                                </a>
                                by specifying your E-Mail.
                            </div>
                        </div>
                    </body>
                </html>`);
        }

        await Database.getInstance().user.update({
            where: { id: verification.userId },
            data: { emailVerified: true },
        });

        await Database.getInstance().verificationToken.delete({
            where: { id: verification.id },
        });

        request.cookieAuth.set({ id: verification.userId });

        return h.redirect('/userprofile');
    }

    async activateResendMailAccount(
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
            where: { email },
            include: {
                verificationTokens: {
                    orderBy: { expiresAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!user || user?.emailVerified) {
            return h
                .response({
                    message: 'Server Side Validation Failed.',
                })
                .type(ContentType.APPLICATION_JSON)
                .code(HttpCode.UNAUTHORIZED);
        }

        if (
            user !== null &&
            !user.emailVerified &&
            user.verificationTokens[0].token &&
            user.verificationTokens[0].expiresAt.getTime() < Date.now()
        ) {
            Logger.info(
                `User ${user.email} already registered but did not confirm account. Regenerating token.`
            );

            const registrationToken = TokenHelper.generateToken();
            const expires = TokenHelper.getTokenLifeTime1Hour();

            await Database.getInstance().verificationToken.updateMany({
                where: { userId: user.id },
                data: {
                    token: registrationToken,
                    expiresAt: expires,
                },
            });

            return this.sendEmail(email, registrationToken, h);
        }

        return h.response(/*html*/ `
            <html>
                <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container mt-5">
                        <div class="alert alert-info" role="info">
                            Your Activation Link is still valid. Please search for your E-Mail in your inbox to activate the account.
                        </div>
                        <a href="/">Home</a>
                    </div>
                </body>
            </html>`);
    }
}
