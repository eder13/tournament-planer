import { jwtVerify, SignJWT } from 'jose';
import TimeHelper from '../time';
import { TokenInvalidError } from '../../errors/token-invalid';
import Logger from '../logger';

class JWTHelper {
    static readonly secretEncoded = new TextEncoder().encode(
        process.env.JWT_SECRET ?? 'TO4NRP1HMALxxCFnRZABFA7GOJtzU_gI'
    );
    static readonly issuer = process.env.JWT_AUD ?? '';

    static async generateJWTEmailReset(email: string, jti: string) {
        const token = await new SignJWT({ email, jti })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setAudience(this.issuer)
            .sign(this.secretEncoded);

        return token;
    }

    static async verfyJWTSecretEmailReset(token: string) {
        try {
            const jwt = await jwtVerify(token, this.secretEncoded);
            const { iat, exp, aud } = jwt.payload;
            const currentTime = TimeHelper.getCurrentUnixTimestampSeconds();

            if (!((exp ?? Infinity) > currentTime)) {
                throw new TokenInvalidError('Token already expired!');
            }

            if (iat && currentTime < iat) {
                throw new TokenInvalidError(
                    'The Token was issued somewhere in the future!'
                );
            }

            if (aud && aud !== this.issuer) {
                throw new TokenInvalidError(
                    'The Token was issued from someone unknown!'
                );
            }

            return {
                email: jwt.payload.email,
                jti: jwt.payload.jti,
                success: true,
            };
        } catch (e) {
            if (e instanceof Error) {
                Logger.error(e.message);
            } else {
                Logger.error('Failed to validate JWT secret from email');
            }

            return {
                email: '',
                jti: '',
                success: false,
            };
        }
    }
}

export default JWTHelper;
