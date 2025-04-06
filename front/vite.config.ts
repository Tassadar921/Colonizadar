import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';
import fs from 'fs';

const isDev: boolean = process.env.NODE_ENV !== 'production';
const baseEnv = dotenv.parse(fs.readFileSync('.env', 'utf8'));
let envVariables = { ...baseEnv };

if (isDev) {
    const localEnvPath = '.env.local';
    if (fs.existsSync(localEnvPath)) {
        const localEnv = dotenv.parse(fs.readFileSync(localEnvPath, 'utf8'));
        envVariables = { ...envVariables, ...localEnv };
    }
}

const viteEnv: Record<string, string> = {};
for (const [key, value] of Object.entries(envVariables)) {
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
