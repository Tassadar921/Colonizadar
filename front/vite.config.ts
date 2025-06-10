import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: true,
        port: Number(process.env.VITE_PORT),
        allowedHosts: ['localhost', 'app.colonizadar.fr', 'app.colonizadar.dev'],
    },
    plugins: [svelte(), tailwindcss()],
});
