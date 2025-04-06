import { defineConfig } from '@adonisjs/cors';
import { CorsConfig } from '@adonisjs/cors/types';
import env from '#start/env';

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
console.log(env.get('FRONT_URI'));
const corsConfig: CorsConfig = defineConfig({
    enabled: true,
    origin: env.get('FRONT_URI'),
    methods: ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposeHeaders: [],
    credentials: true,
    maxAge: 90,
});

export default corsConfig;
