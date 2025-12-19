export enum HTTPMethod {
    POST = 'post',
    GET = 'get',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch',
}

export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ContentType {
    TEXT_HTML = 'text/html; charset=utf-8',
    APPLICATION_JSON = 'application/json',
}

export const SeparatorPlayerUUIDDatabaes = '.:-:.';
