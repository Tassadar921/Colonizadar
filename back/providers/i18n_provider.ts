import type { ApplicationService } from '@adonisjs/core/types';
import i18nManager from '@adonisjs/i18n/services/main';
import chokidar, { FSWatcher } from 'chokidar';
import env from '#start/env';

export default class I18NProvider {
    constructor(protected app: ApplicationService) {}

    register(): void {}

    async boot(): Promise<void> {}

    async start(): Promise<void> {}

    async ready(): Promise<void> {
        if (env.get('NODE_ENV') !== 'production') {
            const watcher: FSWatcher = chokidar.watch('resources/lang', {
                usePolling: true,
                interval: 300,
                ignoreInitial: true,
            });

            watcher.on('change', async (path: string): Promise<void> => {
                console.log(`[i18n] Reloading translations due to change in: ${path}`);
                await i18nManager.reloadTranslations();
            });
        }
    }

    async shutdown(): Promise<void> {}
}
