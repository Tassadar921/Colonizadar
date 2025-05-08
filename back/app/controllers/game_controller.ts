import { HttpContext } from '@adonisjs/core/http';
import RoomPlayer from '#models/room_player';
import { setReadyValidator } from '#validators/room_player';
import transmit from '@adonisjs/transmit/services/main';
import { buyInfantryValidator, buyShipsValidator, financePlayerParamsValidator, financePlayerValidator, financeWildTerritoryValidator, spyPlayerParamsValidator } from '#validators/game';
import RoomStatusEnum from '#types/enum/room_status_enum';
import { inject } from '@adonisjs/core';
import RegexService from '#services/regex_service';

@inject()
export default class GameController {
    constructor(private readonly regexService: RegexService) {}

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

            game.room.status = RoomStatusEnum.WAITING;
            await game.room.save();

            transmit.broadcast(`notification/play/game/${game.frontId}/next-turn`);
        }
    }

    public async spyTerritory({ response, user, player, game, gameTerritory, language }: HttpContext): Promise<void> {
        const cost: number = gameTerritory.isFortified ? game.map.spyFortifiedTerritoryCost : game.map.spyTerritoryCost;
        if (player.gold < cost) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= cost;
        await player.save();

        return response.send(gameTerritory.apiSerialize(language, user, true));
    }

    public async spyPlayer({ request, response, user, player, game, language }: HttpContext): Promise<void> {
        const { playerId } = await spyPlayerParamsValidator.validate(request.params());
        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't spy yourself" });
        } else if (player.gold < game.map.spyPlayerCost) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        }

        player.gold -= game.map.spyPlayerCost;
        await player.save();

        return response.send({
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user, true),
            message: `Successfully spied ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)}`,
        });
    }

    public async financePlayer({ request, response, player, game, language, user }: HttpContext): Promise<void> {
        const { playerId } = await financePlayerParamsValidator.validate(request.params());
        const { amount } = await request.validateUsing(financePlayerValidator);

        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't finance yourself" });
        } else if (player.gold < amount) {
            return response.forbidden({ error: 'Not enough gold' });
        } else if (amount % game.map.financePlayerStep !== 0) {
            return response.forbidden({ error: 'Invalid amount' });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        }

        player.gold -= amount;
        await player.save();

        targetPlayer.gold += Math.floor((amount * game.map.financePlayerCostFactor) / 1000) * 1000;
        await targetPlayer.save();

        // TODO: send notification to target player

        return response.send({
            player: player.apiSerialize(language, user),
            message: `Successfully sent ${this.regexService.formatGameNumbers(amount)} to ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)}`,
        });
    }

    public async financeWildTerritory({ request, response, player, game, gameTerritory, language, user }: HttpContext): Promise<void> {
        const { amount } = await request.validateUsing(financeWildTerritoryValidator);

        if (player.gold < amount) {
            return response.forbidden({ error: 'Not enough gold' });
        } else if (amount % game.map.financeWildTerritoryStep !== 0) {
            return response.forbidden({ error: 'Invalid amount' });
        }

        player.gold -= amount;
        await player.save();

        gameTerritory.infantry += Math.floor((amount * game.map.financeWildTerritoryEnforcementFactor * game.map.financeWildTerritoryCostFactor) / (game.map.wildInfantryCostFactor * 1000));
        await gameTerritory.save();

        return response.send({
            player: player.apiSerialize(language, user),
            message: `Successfully sent ${this.regexService.formatGameNumbers(amount)} to ${gameTerritory.territory.translate(language)}`,
        });
    }

    public async subverse({ response, player, gameTerritory, game, language, user }: HttpContext): Promise<void> {
        if (player.gold < game.map.baseSubversionCost) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= game.map.baseSubversionCost;
        await player.save();

        gameTerritory.infantry -= Math.ceil((100 * 1000 * game.map.wildTerritorySubversionFactor * game.map.financeWildTerritoryCostFactor) / (game.map.wildInfantryCostFactor * 1000));
        // TODO: manage the case where players subverse the same territory at the same time
        if (gameTerritory.infantry <= 0) {
            gameTerritory.infantry = 1000;
            gameTerritory.ownerId = player.id;
        }
        await gameTerritory.save();

        return response.send({ conquered: !!gameTerritory.ownerId, player: player.apiSerialize(language, user) });
    }

    public async fortify({ response, user, language, player, gameTerritory, game }: HttpContext): Promise<void> {
        if (player.gold < game.map.fortifyCost) {
            return response.forbidden({ error: 'Not enough gold' });
        } else if (gameTerritory.isFortified) {
            return response.forbidden({ error: 'Already fortified' });
        }

        player.gold -= game.map.fortifyCost;
        await player.save();

        gameTerritory.isFortified = true;
        await gameTerritory.save();

        return response.send({
            territory: gameTerritory.apiSerialize(language, user),
            player: player.apiSerialize(language, user),
            message: `Fortified ${gameTerritory.territory.translate(language)}`,
        });
    }

    public async buyInfantry({ request, response, user, player, gameTerritory, game, language }: HttpContext): Promise<void> {
        const { amount } = await request.validateUsing(buyInfantryValidator);

        if (!gameTerritory.territory.isFactory) {
            return response.forbidden({ error: 'This territory is not a factory' });
        } else if (amount < 1000 || amount % 1000 !== 0) {
            return response.badRequest({ error: 'Invalid infantry amount' });
        }

        const cost: number = game.map.baseInfantryCost * player.country.infantryPriceFactor * amount;

        if (player.gold < cost) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= cost;
        await player.save();

        gameTerritory.infantry += amount;
        await gameTerritory.save();

        return response.send({
            territory: gameTerritory.apiSerialize(language, user),
            player: player.apiSerialize(language, user),
            message: `Bought ${this.regexService.formatGameNumbers(amount)} infantry for ${this.regexService.formatGameNumbers(cost)}`,
        });
    }

    public async buyShips({ request, response, user, player, gameTerritory, game, language }: HttpContext): Promise<void> {
        const { amount } = await request.validateUsing(buyShipsValidator);

        if (!gameTerritory.territory.isFactory) {
            return response.forbidden({ error: 'This territory is not a factory' });
        } else if (amount < 5 || amount % 5 !== 0) {
            return response.badRequest({ error: 'Invalid ships amount' });
        }

        const cost: number = game.map.baseShipCost * player.country.shipPriceFactor * amount;

        if (player.gold < cost) {
            return response.forbidden({ error: 'Not enough gold' });
        }

        player.gold -= cost;
        await player.save();

        gameTerritory.ships += amount;
        await gameTerritory.save();

        return response.send({
            territory: gameTerritory.apiSerialize(language, user),
            player: player.apiSerialize(language, user),
            message: `Bought ${this.regexService.formatGameNumbers(amount)} ships for ${this.regexService.formatGameNumbers(cost)}`,
        });
    }
}
