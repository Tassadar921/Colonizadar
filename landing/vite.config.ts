import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: true,
        port: Number(process.env.VITE_PORT),
        allowedHosts: ['localhost', 'colonizadar.fr', 'colonizadar.dev'],
    },
    plugins: [svelte(), tailwindcss()],
    resolve: {
        alias: {
            $lib: path.resolve('./src/lib'),
        },
    },
});
