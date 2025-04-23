import type { ApplicationService } from '@adonisjs/core/types';
import Language from '#models/language';
import User from '#models/user';
import Room from '#models/room';
import { inject } from '@adonisjs/core';
import Game from '#models/game';
import RoomPlayer from '#models/room_player';

declare module '@adonisjs/core/http' {
    export interface HttpContext {
        language: Language;
        user: User;
        room: Room;
        game: Game;
        player: RoomPlayer;
    }
}

@inject()
export default class HttpContextProvider {
    constructor(protected app: ApplicationService) {}

    /**
     * Register bindings to the container
     */
    public register(): void {}

    /**
     * The container bindings have booted
     */
    public async boot(): Promise<void> {}

    /**
     * The application has been booted
     */
    public async start(): Promise<void> {}

    /**
     * The process has been started
     */
    public async ready(): Promise<void> {}

    /**
     * Preparing to shutdown the app
     */
    public async shutdown(): Promise<void> {}
}
