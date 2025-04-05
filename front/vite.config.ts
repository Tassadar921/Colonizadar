import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';
import fs from 'fs';

const baseEnv = dotenv.parse(fs.readFileSync('.env', 'utf8'));

const viteEnv: Record<string, string> = {};
for (const [key, value] of Object.entries({ ...baseEnv })) {
    if (key.startsWith('VITE_')) {
        viteEnv[`process.env.${key}`] = JSON.stringify(value);
    }
}

export default defineConfig({
    server: {
        host: true,
        port: 5173,
        allowedHosts: ['localhost', 'app.colonizadar.fr'],
    },
    plugins: [svelte()],
    define: {
        ...viteEnv,
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: '[name].[hash].[ext]',
            },
        },
    },
});
