export class TokenInvalidError extends Error {
    public type: string;
    constructor(message: string) {
        super(message);
        this.type = 'invalid-token-error';
    }
}
