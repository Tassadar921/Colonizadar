/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
    PORT: Env.schema.number(),
    HOST: Env.schema.string({ format: 'host' }),
    NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
    APP_KEY: Env.schema.string(),
    LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

    /*
|----------------------------------------------------------
| Variables for configuring database connection
|----------------------------------------------------------
*/
    DB_CONNECTION: Env.schema.enum(['pg', 'mysql']),

    DB_HOST: Env.schema.string({ format: 'host' }),
    DB_PORT: Env.schema.number(),
    DB_USER: Env.schema.string(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string(),

    LOGS_HOST: Env.schema.string({ format: 'host' }),
    LOGS_PORT: Env.schema.number(),
    LOGS_USER: Env.schema.string(),
    LOGS_PASSWORD: Env.schema.string.optional(),
    LOGS_DATABASE: Env.schema.string(),

    REDIS_HOST: Env.schema.string({ format: 'host' }),
    REDIS_PORT: Env.schema.number(),
    REDIS_PASSWORD: Env.schema.string.optional(),

    FRONT_URI: Env.schema.string(),
    API_URI: Env.schema.string(),
    ACCOUNT_SENDER_EMAIL: Env.schema.string(),
    BREVO_API_KEY: Env.schema.string(),
    FRIEND_EMAILS: Env.schema.string(),
});
