import { AccessToken } from '@adonisjs/auth/access_tokens';
import { transmitAccessTokenValidator } from '#validators/query_string';

export default class TransmitAuthService {
    public async auth(token: string): Promise<boolean> {
        const { token: validatedToken } = await transmitAccessTokenValidator.validate({ token });

        try {
            return AccessToken.decode('oat_', validatedToken) !== null;
        } catch (error) {
            return false;
        }
    }
}
