import type { ApplicationService } from '@adonisjs/core/types';
import Language from '#models/language';
import User from '#models/user';
import Room from '#models/room';
import {DateTime} from "luxon";
import RoomRepository from "#repositories/room_repository";
import {inject} from "@adonisjs/core";
import transmit from "@adonisjs/transmit/services/main";

declare module '@adonisjs/core/http' {
    export interface HttpContext {
        language: Language;
        user: User;
        room: Room;
    }
}

@inject()
export default class HttpContextProvider {
    protected roomRepository: RoomRepository = new RoomRepository();

    constructor(protected app: ApplicationService,) {}

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
    public async ready(): Promise<void> {
        setInterval(async (): Promise<void> => {
            const rooms = await this.roomRepository.getPaginatedForHeartbeatChecks(1);
            await this.processRoomPage(rooms.all());
            const now: DateTime = DateTime.now();

            if (rooms.lastPage === 1) {
                return;
            }

            for (let i = 2; i < rooms.lastPage; i++) {
                const rooms = await this.roomRepository.getPaginatedForHeartbeatChecks(i + 1);
                await this.processRoomPage(rooms.all());
                console.log(`Page ${i + 1} processed in ${now.diff(DateTime.now(), 'seconds').seconds} seconds`);
            }
        }, 5000);
    }

    /**
     * Preparing to shutdown the app
     */
    public async shutdown(): Promise<void> {}

    private async processRoomPage(rooms: Room[]): Promise<void> {
        const now: DateTime = DateTime.now();
        for (const room of rooms) {
            for (const player of room.players) {
                console.log(now.diff(player.lastHeartbeat, 'seconds').seconds);
                if (player.lastHeartbeat && now.diff(player.lastHeartbeat, 'seconds').seconds > 5) {
                    console.log(`Player ${player.user.username} kicked from room ${room.name}`);
                    await player.delete();

                    transmit.broadcast(`notification/play/room/${room.frontId}/leave`, { user: player.user.apiSerialize() });
                }
            }
        }
    }
}
