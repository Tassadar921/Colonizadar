import type { ApplicationService } from '@adonisjs/core/types';
import Language from '#models/language';
import User from '#models/user';
import Room from '#models/room';

declare module '@adonisjs/core/http' {
    export interface HttpContext {
        language: Language;
        user: User;
        room: Room;
    }
}

export default class HttpContextProvider {
    constructor(protected app: ApplicationService) {}

    /**
     * Register bindings to the container
     */
    register(): void {}

    /**
     * The container bindings have booted
     */
    async boot(): Promise<void> {}

    /**
     * The application has been booted
     */
    async start(): Promise<void> {}

    /**
     * The process has been started
     */
    async ready(): Promise<void> {}

    /**
     * Preparing to shutdown the app
     */
    async shutdown(): Promise<void> {}
}
