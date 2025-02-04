import type { ApplicationService } from '@adonisjs/core/types';
import Room from '#models/room';
import { DateTime } from 'luxon';
import transmit from '@adonisjs/transmit/services/main';
import RoomRepository from '#repositories/room_repository';
import path from "node:path";

export default class RoomProvider {
    protected roomRepository: RoomRepository = new RoomRepository();

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
    public async ready(): Promise<void> {
        // Skip interval if running command
        if (process.argv.includes(`/${path.relative('/', '')}/ace`)) {
            return;
        }

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
    async shutdown(): Promise<void> {}

    private async processRoomPage(rooms: Room[]): Promise<void> {
        const now: DateTime = DateTime.now();
        for (const room of rooms) {
            for (const player of room.players) {
                if (player.lastHeartbeat && now.diff(player.lastHeartbeat, 'seconds').seconds > 5) {
                    console.log(`Player ${player.user.username} kicked from room ${room.name}`);
                    await player.delete();

                    transmit.broadcast(`notification/play/room/${room.frontId}/leave`, { user: player.user.apiSerialize() });
                }
            }
        }
    }
}
