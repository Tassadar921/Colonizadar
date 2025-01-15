import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import { AccessToken } from '@adonisjs/auth/access_tokens';

@inject()
export default class QueryStringAuthMiddleware {
    public async handle(ctx: HttpContext, next: () => Promise<void>): Promise<void> {
        const token = ctx.request.input('token');

        if (!token) {
            return ctx.response.badRequest({ error: 'Token is required' });
        }

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
