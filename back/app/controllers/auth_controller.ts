import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';

@inject()
export default class AuthController {
    public async login({ request, response }: HttpContext): Promise<void> {
        try {
            const { email, password } = request.only(['email', 'password']);

            const user: User = await User.verifyCredentials(email, password);
            await user.load('profilePicture');

            const token: AccessToken = await User.accessTokens.create(user);

            return response.send({
                message: 'Logged in',
                token,
                user: user.apiSerialize(),
            });
        } catch (e) {
            return response.unauthorized({ error: 'API Login failed' });
        }
    }

    public async logout({ auth, response }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        await User.accessTokens.delete(user, user.currentAccessToken.identifier);
        return response.send({ revoked: true });
    }
}
