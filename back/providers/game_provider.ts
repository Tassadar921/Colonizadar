import type { ApplicationService } from '@adonisjs/core/types';
import { DateTime } from 'luxon';
import transmit from '@adonisjs/transmit/services/main';
import path from 'node:path';
import RoomStatusEnum from '#types/enum/room_status_enum';
import Language from '#models/language';
import LanguageRepository from '#repositories/language_repository';
import GameRepository from '#repositories/game_repository';
import Game from '#models/game';

export default class gameProvider {
    private readonly gameRepository: GameRepository = new GameRepository();
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
            const games = await this.gameRepository.getPaginatedForGameHeartbeatChecks(1);
            await this.processGamePage(games.all(), english);

            if (games.lastPage === 1) {
                return;
            }

            for (let currentPage = games.currentPage + 1; currentPage < games.lastPage; currentPage++) {
                const games = await this.gameRepository.getPaginatedForGameHeartbeatChecks(currentPage);
                await this.processGamePage(games.all(), english);
            }
        }, 1000);
    }

    public async shutdown(): Promise<void> {}

    private async processGamePage(games: Game[], english: Language): Promise<void> {
        const now: DateTime = DateTime.now();
        for (const game of games) {
            for (const player of game.room.players) {
                const lastHeartbeat: number = now.diff(player.lastHeartbeat, 'seconds').seconds;
                if (player.userId && lastHeartbeat > 10) {
                    game.room.status = RoomStatusEnum.WAITING;
                    await game.room.save();

                    transmit.broadcast(`notification/play/game/${game.frontId}/player/left`, { player: player.apiSerialize(english), secondsLeft: 70 - Math.floor(lastHeartbeat) });

                    if (lastHeartbeat > 70) {
                        game.room.status = RoomStatusEnum.CLOSED;
                        await game.room.save();

                        transmit.broadcast(`notification/play/game/${game.frontId}/closed`);
                    }
                }
            }
        }
    }
}
