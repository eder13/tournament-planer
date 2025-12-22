import crypto from 'node:crypto';

class TokenHelper {
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static getTokenLifeTime1Hour() {
        return new Date(Date.now() + 1000 * 60 * 60);
    }
}

export default TokenHelper;
