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

    public register(): void {}

    public async boot(): Promise<void> {}

    public async start(): Promise<void> {}

    public async ready(): Promise<void> {
        // Skip interval if running command
        if (process.argv.includes(`/${path.relative('/', '')}/ace`)) {
            return;
        }

        const english: Language = await this.languageRepository.firstOrFail({ code: Language.LANGUAGE_ENGLISH.code });

        setInterval(async (): Promise<void> => {
            const rooms = await this.roomRepository.getPaginatedForRoomHeartbeatChecks(1);
            await this.processRoomPage(rooms.all(), english);

            if (rooms.lastPage === 1) {
                return;
            }

            for (let currentPage = rooms.currentPage + 1; currentPage < rooms.lastPage; currentPage++) {
                const rooms = await this.roomRepository.getPaginatedForRoomHeartbeatChecks(currentPage);
                await this.processRoomPage(rooms.all(), english);
            }
        }, 5000);
    }

    public async shutdown(): Promise<void> {}

    private async processRoomPage(rooms: Room[], english: Language): Promise<void> {
        const now: DateTime = DateTime.now();
        for (const room of rooms) {
            for (const player of room.players) {
                if (player.userId && now.diff(player.lastHeartbeat, 'seconds').seconds > 30) {
                    if (room.ownerId === player.userId) {
                        room.status = RoomStatusEnum.CLOSED;
                        await room.save();

                        transmit.broadcast(`notification/play/room/${room.frontId}/closed`);
                    } else {
                        await player.delete();

                        transmit.broadcast(`notification/play/room/${room.frontId}/player/leave`, { player: player.apiSerialize(english) });
                    }
                }
            }
        }
    }
}
