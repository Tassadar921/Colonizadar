import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: true,
        port: 5173,
        allowedHosts: ['localhost', 'app.colonizadar.fr'],
    },
    plugins: [svelte(), tailwindcss()],
});
