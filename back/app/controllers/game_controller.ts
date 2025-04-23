import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import RoomPlayer from '#models/room_player';
import { setReadyValidator } from '#validators/room_player';
import transmit from '@adonisjs/transmit/services/main';

@inject()
export default class GameController {
    constructor() {}

    public async get({ response, user, language, game }: HttpContext): Promise<void> {
        return response.send({ game: game.apiSerialize(language, user) });
    }

    public async ready({ request, response, user, game, language }: HttpContext): Promise<void> {
        const player: RoomPlayer | undefined = game.room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
        if (!player) {
            return response.notFound({ error: 'You are not into this room' });
        }

        const { isReady } = await request.validateUsing(setReadyValidator);

        player.isReady = isReady;
        await player.save();

        transmit.broadcast(`notification/play/game/${game.frontId}/player/update`, { player: player.apiSerialize(language, user) });
        response.send({ message: `Set to ${isReady ? 'ready' : 'not ready'}` });

        if (game.room.players.every((player: RoomPlayer): boolean => (player.botId ? true : player.isReady))) {
            switch (game.season === 4) {
                case true:
                    game.season = 1;
                    game.year++;
                    break;
                case false:
                    game.season++;
                    break;
            }
            await game.save();
            transmit.broadcast(`notification/play/game/${game.frontId}/next-turn`);
        }
    }
}
