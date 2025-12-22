import { ServerRoute } from '@hapi/hapi';
import { HTTPMethod } from '../constants/common';

export const authRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/login',
        handler: 'AuthController.login',
        options: {
            auth: {
                mode: 'try',
            },
        },
    },
    {
        method: 'POST',
        path: '/forgot',
        handler: 'AuthController.forgot',
        options: {
            auth: {
                mode: 'try',
            },
        },
    },
    {
        method: ['GET', HTTPMethod.POST],
        options: {
            auth: {
                mode: 'try',
            },
        },
        path: '/change-password',
        handler: 'AuthController.changePassword',
    },
    {
        method: 'GET',
        path: '/profile',
        handler: 'AuthController.user',
        options: {
            plugins: { cookie: { redirectTo: false } },
        },
    },
    {
        method: 'POST',
        path: '/logout',
        handler: 'AuthController.logout',
    },
    {
        method: 'POST',
        path: '/register',
        handler: 'AuthController.register',
        options: {
            auth: {
                mode: 'try',
            },
        },
    },
    {
        method: 'GET',
        path: '/verifyuser/{token}',
        handler: 'AuthController.registerVerify',
        options: {
            auth: {
                mode: 'try',
            },
        },
    },
    {
        method: 'POST',
        path: '/user/activate',
        handler: 'AuthController.activateResendMailAccount',
        options: {
            auth: {
                mode: 'try',
            },
        },
    },
];
