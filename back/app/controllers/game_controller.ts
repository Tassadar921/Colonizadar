import { HttpContext } from '@adonisjs/core/http';
import RoomPlayer from '#models/room_player';
import { setReadyValidator } from '#validators/room_player';
import transmit from '@adonisjs/transmit/services/main';

export default class GameController {
    public async get({ response, user, language, game }: HttpContext): Promise<void> {
        return response.send({ game: game.apiSerialize(language, user) });
    }

    public async ready({ request, response, user, player, game, language }: HttpContext): Promise<void> {
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

    public async spyTerritory({ response, user, player, gameTerritory, language }: HttpContext): Promise<void> {
        // TODO: make price depend on the map
        if (player.gold < 200) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= 200;
        await player.save();

        return response.send(gameTerritory.apiSerialize(language, user, true));
    }
}
