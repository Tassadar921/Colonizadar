import { HttpContext } from '@adonisjs/core/http';
import RoomPlayer from '#models/room_player';
import { setReadyValidator } from '#validators/room_player';
import transmit from '@adonisjs/transmit/services/main';
import { financePlayerValidator, financeWildTerritoryValidator } from '#validators/game';

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

    public async spyTerritory({ response, user, player, game, gameTerritory, language }: HttpContext): Promise<void> {
        if (player.gold < game.map.spyCost) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= game.map.spyCost;
        await player.save();

        return response.send(gameTerritory.apiSerialize(language, user, true));
    }

    public async financePlayer({ request, response, player, game }: HttpContext): Promise<void> {
        const { amount, playerId } = await request.validateUsing(financePlayerValidator);

        if (player.gold < amount) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Player not found' });
        }

        player.gold -= amount;
        await player.save();

        targetPlayer.gold += Math.floor((amount * game.map.financePlayerCostFactor) / 1000) * 1000;
        await targetPlayer.save();

        return response.send({ message: 'Transaction done' });
    }

    public async financeWildTerritory({ request, response, player, game, gameTerritory }: HttpContext): Promise<void> {
        const { amount } = await request.validateUsing(financeWildTerritoryValidator);

        if (player.gold < amount) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= amount;
        await player.save();

        gameTerritory.power += Math.ceil((amount * 1000 * game.map.financeWildTerritoryEnforcementFactor * game.map.financeWildTerritoryCostFactor) / (game.map.wildInfantryCostFactor * 1000));
        await gameTerritory.save();

        return response.send({ message: 'Transaction done' });
    }
}
