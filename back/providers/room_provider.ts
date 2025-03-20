import type { ApplicationService } from '@adonisjs/core/types';
import Room from '#models/room';
import { DateTime } from 'luxon';
import transmit from '@adonisjs/transmit/services/main';
import RoomRepository from '#repositories/room_repository';
import path from 'node:path';
import RoomStatusEnum from '#types/enum/room_status_enum';
import Language from '#models/language';
import LanguageRepository from '#repositories/language_repository';

export default class RoomProvider {
    private readonly roomRepository: RoomRepository = new RoomRepository();
    private readonly languageRepository: LanguageRepository = new LanguageRepository();

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

        const english: Language | null = await this.languageRepository.findOneBy({ code: Language.LANGUAGE_ENGLISH.code });
        if (!english) {
            throw new Error('English language not found');
        }

        setInterval(async (): Promise<void> => {
            const rooms = await this.roomRepository.getPaginatedForHeartbeatChecks(1);
            await this.processRoomPage(rooms.all(), english);
            const now: DateTime = DateTime.now();

            if (rooms.lastPage === 1) {
                return;
            }

            for (let i = 2; i < rooms.lastPage; i++) {
                const rooms = await this.roomRepository.getPaginatedForHeartbeatChecks(i + 1);
                await this.processRoomPage(rooms.all(), english);
                console.log(`Page ${i + 1} processed in ${now.diff(DateTime.now(), 'seconds').seconds} seconds`);
            }
        }, 5000);
    }

    /**
     * Preparing to shutdown the app
     */
    async shutdown(): Promise<void> {}

    private async processRoomPage(rooms: Room[], english: Language): Promise<void> {
        const now: DateTime = DateTime.now();
        for (const room of rooms) {
            for (const player of room.players) {
                if (player.userId && now.diff(player.lastHeartbeat, 'seconds').seconds > 30) {
                    await player.load('country');
                    await player.delete();

                    transmit.broadcast(`notification/play/room/${room.frontId}/player/leave`, { player: player.apiSerialize(english) });

                    if (room.ownerId === player.userId) {
                        room.status = RoomStatusEnum.CLOSED;
                        await room.save();

                        transmit.broadcast(`notification/play/room/${room.frontId}/closed`);
                    }
                }
            }
        }
    }
}
