import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { queryStringAccessTokenValidator } from '#validators/query_string';
import UserRepository from '#repositories/user_repository';

@inject()
export default class QueryStringAuthMiddleware {
    constructor(private readonly userRepository: UserRepository) {}

    public async handle(ctx: HttpContext, next: () => Promise<void>): Promise<void> {
        const { token } = await ctx.request.validateUsing(queryStringAccessTokenValidator);

        try {
            const decodedToken = AccessToken.decode('oat_', token);
            if (!decodedToken) {
                return ctx.response.unauthorized({ error: 'Invalid or expired token' });
            }

            ctx.user = await this.userRepository.findOneByToken(decodedToken.identifier);
            return await next();
        } catch (error) {
            console.error(error);
            return ctx.response.unauthorized({ error: 'Invalid or expired token' });
        }
    }
}
