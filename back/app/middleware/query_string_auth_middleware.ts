import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { queryStringAccessTokenValidator } from '#validators/query_string';

@inject()
export default class QueryStringAuthMiddleware {
    public async handle(ctx: HttpContext, next: () => Promise<void>): Promise<void> {
        const { token } = await queryStringAccessTokenValidator.validate(ctx.request.all());

        try {
            if (AccessToken.decode('oat_', token) === null) {
                return ctx.response.unauthorized({ error: 'Invalid or expired token' });
            }

            await next();
        } catch (error) {
            return ctx.response.unauthorized({ error: 'Invalid or expired token' });
        }
    }
}
