import crypto from 'node:crypto';

class TokenHelper {
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    static getTokenLifeTime1Hour() {
        return new Date(Date.now() + 1000 * 60 * 60);
    }
}

export default TokenHelper;
