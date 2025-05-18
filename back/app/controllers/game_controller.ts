import { HttpContext } from '@adonisjs/core/http';
import RoomPlayer from '#models/room_player';
import { setReadyValidator } from '#validators/room_player';
import transmit from '@adonisjs/transmit/services/main';
import {
    askPeaceParamsValidator,
    buyInfantryValidator,
    buyShipsValidator,
    cancelPendingPeaceParamsValidator,
    declareWarParamsValidator,
    financePlayerParamsValidator,
    financePlayerValidator,
    financeWildTerritoryValidator,
    makePeaceParamsValidator,
    refusePeaceParamsValidator,
    spyPlayerParamsValidator,
} from '#validators/game';
import RoomStatusEnum from '#types/enum/room_status_enum';
import { inject } from '@adonisjs/core';
import RegexService from '#services/regex_service';
import War from '#models/war';
import WarRepository from '#repositories/war_repository';
import PendingPeaceRepository from '#repositories/pending_peace_repository';
import PeaceRepository from '#repositories/peace_repository';
import PendingPeace from '#models/pending_peace';
import PeaceStatusEnum from '#types/enum/peace_status_enum';
import WarStatusEnum from "#types/enum/war_status_enum";

@inject()
export default class GameController {
    constructor(
        private readonly regexService: RegexService,
        private readonly warRepository: WarRepository,
        private readonly pendingPeaceRepository: PendingPeaceRepository,
        private readonly peaceRepository: PeaceRepository
    ) {}

    public async get({ response, user, language, game }: HttpContext): Promise<void> {
        return response.send(game.apiSerialize(language, user));
    }

    public async getPlayer({ response, player, user, language }: HttpContext): Promise<void> {
        return response.send(player.apiSerialize(language, user));
    }

    public async getGameTerritory({ response, gameTerritory, user, language }: HttpContext): Promise<void> {
        return response.send(gameTerritory.apiSerialize(language, user));
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

            // TODO: after end of turn, check peaces and update statuses if needed

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

        return response.send({
            territory: gameTerritory.apiSerialize(language, user, true),
            player: player.apiSerialize(language, user),
            message: `Successfully spied ${gameTerritory.territory.translate(language)}`,
        });
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

        transmit.broadcast(`notification/play/game/${game.frontId}/${targetPlayer.frontId}/spied`, {
            player: player.apiSerialize(language, user),
        });

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

        const givenAmount: number = Math.floor((amount * game.map.financePlayerCostFactor) / 1000) * 1000;
        targetPlayer.gold += givenAmount;

        await Promise.all([player.save(), targetPlayer.save()]);

        transmit.broadcast(`notification/play/game/${game.frontId}/${targetPlayer.frontId}/financed`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user, true),
            amount: givenAmount,
        });

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
        } else if (gameTerritory.ownerId) {
            return response.forbidden({ error: 'This territory is already owned' });
        }

        player.gold -= amount;
        gameTerritory.infantry += Math.floor((amount * game.map.financeWildTerritoryEnforcementFactor * game.map.financeWildTerritoryCostFactor) / (game.map.wildInfantryCostFactor * 1000));

        await Promise.all([player.save(), gameTerritory.save()]);

        return response.send({
            player: player.apiSerialize(language, user),
            message: `Successfully sent ${this.regexService.formatGameNumbers(amount)} to ${gameTerritory.territory.translate(language)}`,
        });
    }

    public async subvert({ response, player, gameTerritory, game, language, user }: HttpContext): Promise<void> {
        if (player.gold < game.map.subvertCost) {
            return response.forbidden({ error: 'Not enough gold' });
        } else if (gameTerritory.ownerId) {
            return response.forbidden({ error: 'This territory is already owned' });
        }

        player.gold -= game.map.subvertCost;

        gameTerritory.infantry -= Math.ceil((100 * 1000 * game.map.wildTerritorySubvertFactor) / (game.map.wildInfantryCostFactor * 1000));
        if (gameTerritory.infantry <= 0) {
            gameTerritory.infantry = 1000;
            gameTerritory.ownerId = player.id;
        }

        await Promise.all([player.save(), gameTerritory.save()]);

        if (gameTerritory.ownerId) {
            await gameTerritory.load('owner', (ownerQuery): void => {
                ownerQuery.preload('user').preload('bot').preload('country').preload('difficulty');
            });

            transmit.broadcast(`notification/play/game/${game.frontId}/territory/update`, {
                territory: gameTerritory.apiSerialize(language, user),
            });

            return response.send({
                player: player.apiSerialize(language, user),
                message: `Successfully subverted ${gameTerritory.territory.translate(language)}`,
            });
        }

        return response.send({
            player: player.apiSerialize(language, user),
        });
    }

    public async fortify({ response, user, language, player, gameTerritory, game }: HttpContext): Promise<void> {
        if (player.gold < game.map.fortifyCost) {
            return response.forbidden({ error: 'Not enough gold' });
        } else if (gameTerritory.isFortified) {
            return response.forbidden({ error: 'Already fortified' });
        }

        player.gold -= game.map.fortifyCost;
        gameTerritory.isFortified = true;

        await Promise.all([player.save(), gameTerritory.save()]);

        transmit.broadcast(`notification/play/game/${game.frontId}/territory/update`, {
            territory: gameTerritory.apiSerialize(language, user),
        });

        return response.send({
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
        gameTerritory.infantry += amount;

        await Promise.all([player.save(), gameTerritory.save()]);

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
        gameTerritory.ships += amount;

        await Promise.all([player.save(), gameTerritory.save()]);

        return response.send({
            territory: gameTerritory.apiSerialize(language, user),
            player: player.apiSerialize(language, user),
            message: `Bought ${this.regexService.formatGameNumbers(amount)} ships for ${this.regexService.formatGameNumbers(cost)}`,
        });
    }

    public async declareWar({ request, response, user, player, game, language }: HttpContext): Promise<void> {
        const { playerId } = await declareWarParamsValidator.validate(request.params());

        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't declare war on yourself" });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((loopPlayer: RoomPlayer): boolean => loopPlayer.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        } else if (player.wars.find((war: War): boolean => war.enemyId === targetPlayer.id)) {
            return response.forbidden({ error: 'You are already at war' });
        }

        await this.warRepository.findOrCreateMany([
            {
                searchPayload: {
                    playerId: player.id,
                    enemyId: targetPlayer.id,
                    startSeason: game.season,
                    startYear: game.year,
                    status: WarStatusEnum.IN_PROGRESS,
                },
            },
            {
                searchPayload: {
                    playerId: targetPlayer.id,
                    enemyId: player.id,
                    startSeason: game.season,
                    startYear: game.year,
                    status: WarStatusEnum.IN_PROGRESS,
                },
            },
        ]);

        await Promise.all([
            player.load('wars', (warsQuery): void => {
                warsQuery.preload('enemy', (enemyQuery): void => {
                    enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                });
            }),
            targetPlayer.load('wars', (warsQuery): void => {
                warsQuery.preload('enemy', (enemyQuery): void => {
                    enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                });
            }),
        ]);

        transmit.broadcast(`notification/play/game/${game.frontId}/war`, { player: player.apiSerialize(language, user), targetPlayer: targetPlayer.apiSerialize(language, user) });

        return response.send({
            message: `Declared war on ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)}`,
        });
    }

    public async askPeace({ request, response, user, player, game, language }: HttpContext): Promise<void> {
        const { playerId } = await askPeaceParamsValidator.validate(request.params());

        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't ask peace to yourself" });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((loopPlayer: RoomPlayer): boolean => loopPlayer.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        } else if (!player.wars.find((war: War): boolean => war.enemyId === targetPlayer.id)) {
            return response.forbidden({ error: 'You are not at war' });
        }

        await this.pendingPeaceRepository.firstOrCreate({
            playerId: player.id,
            enemyId: targetPlayer.id,
        });

        await Promise.all([
            player.load('sentPendingPeaces', (sentPendingPeacesQuery): void => {
                sentPendingPeacesQuery.preload('enemy', (enemyQuery): void => {
                    enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                });
            }),
            targetPlayer.load('receivedPendingPeaces', (receivedPendingPeacesQuery): void => {
                receivedPendingPeacesQuery.preload('player', (enemyQuery): void => {
                    enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                });
            }),
        ]);

        transmit.broadcast(`notification/play/game/${game.frontId}/${player.frontId}/peace/ask`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user),
        });

        transmit.broadcast(`notification/play/game/${game.frontId}/${targetPlayer.frontId}/peace/ask`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user),
        });

        return response.send({
            message: `Asked peace to ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)}`,
        });
    }

    public async acceptPeace({ request, response, user, player, game, language }: HttpContext): Promise<void> {
        const { playerId } = await makePeaceParamsValidator.validate(request.params());

        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't make peace with yourself" });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((loopPlayer: RoomPlayer): boolean => loopPlayer.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        }

        const war: War | undefined = player.wars.find((war: War): boolean => war.enemyId === targetPlayer.id);
        if (!war) {
            return response.forbidden({ error: 'You are not at war' });
        } else if (!player.receivedPendingPeaces.find((pendingPeace: PendingPeace): boolean => pendingPeace.playerId === targetPlayer.id)) {
            return response.forbidden({ error: 'This player has not asked you for a peace' });
        }

        const { years: peaceYears, seasons: peaceSeasons } = game.map.getFormatedPeaceSeasonsInterval();

        await Promise.all([
            this.warRepository.endWar(player, targetPlayer, game),
            this.pendingPeaceRepository.removeByPlayers(player, targetPlayer),
            this.peaceRepository.findOrCreateMany([
                {
                    searchPayload: {
                        playerId: player.id,
                        enemyId: targetPlayer.id,
                        expirationYear: game.year + peaceYears,
                        expirationSeason: game.season + peaceSeasons,
                        status: PeaceStatusEnum.IN_PROGRESS,
                        warId: war.id,
                    },
                },
                {
                    searchPayload: {
                        playerId: targetPlayer.id,
                        enemyId: player.id,
                        expirationYear: game.year + peaceYears,
                        expirationSeason: game.season + peaceSeasons,
                        status: PeaceStatusEnum.IN_PROGRESS,
                        warId: war.id,
                    },
                },
            ]),
        ]);

        await Promise.all([
            player.load('peaces', (peacesQuery): void => {
                peacesQuery
                    .preload('enemy', (enemyQuery): void => {
                        enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                    })
                    .preload('war', (warQuery): void => {
                        warQuery.preload('enemy', (enemyQuery): void => {
                            enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                        });
                    })
                    .where('status', PeaceStatusEnum.IN_PROGRESS);
            }),
            targetPlayer.load('peaces', (peacesQuery): void => {
                peacesQuery
                    .preload('enemy', (enemyQuery): void => {
                        enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                    })
                    .preload('war', (warQuery): void => {
                        warQuery.preload('enemy', (enemyQuery): void => {
                            enemyQuery.preload('user').preload('bot').preload('country').preload('difficulty');
                        });
                    })
                    .where('status', PeaceStatusEnum.IN_PROGRESS);
            }),
        ]);

        (player.receivedPendingPeaces as unknown as PendingPeace[]) = player.receivedPendingPeaces.filter((pendingPeace: PendingPeace): boolean => pendingPeace.playerId !== targetPlayer.id);
        (targetPlayer.sentPendingPeaces as unknown as PendingPeace[]) = targetPlayer.sentPendingPeaces.filter((pendingPeace: PendingPeace): boolean => pendingPeace.enemyId !== player.id);

        (player.wars as unknown as War[]) = player.wars.filter((war: War): boolean => war.enemyId !== targetPlayer.id);
        (targetPlayer.wars as unknown as War[]) = targetPlayer.wars.filter((war: War): boolean => war.enemyId !== player.id);

        transmit.broadcast(`notification/play/game/${game.frontId}/peace`, { player: player.apiSerialize(language, user), targetPlayer: targetPlayer.apiSerialize(language, user) });

        return response.send({
            message: `Made peace with ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)}`,
        });
    }

    public async refusePeace({ request, response, user, player, game, language }: HttpContext): Promise<void> {
        const { playerId } = await refusePeaceParamsValidator.validate(request.params());

        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't make peace with yourself" });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((loopPlayer: RoomPlayer): boolean => loopPlayer.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        } else if (!player.wars.find((war: War): boolean => war.enemyId === targetPlayer.id)) {
            return response.forbidden({ error: 'You are not at war' });
        } else if (!player.receivedPendingPeaces.find((pendingPeace: PendingPeace): boolean => pendingPeace.playerId === targetPlayer.id)) {
            return response.forbidden({ error: 'This player has not asked you for a peace' });
        }

        await this.pendingPeaceRepository.removeByPlayers(player, targetPlayer);

        (player.receivedPendingPeaces as unknown as PendingPeace[]) = player.receivedPendingPeaces.filter((pendingPeace: PendingPeace): boolean => pendingPeace.playerId !== targetPlayer.id);
        (targetPlayer.sentPendingPeaces as unknown as PendingPeace[]) = targetPlayer.sentPendingPeaces.filter((pendingPeace: PendingPeace): boolean => pendingPeace.enemyId !== player.id);

        transmit.broadcast(`notification/play/game/${game.frontId}/${player.frontId}/peace/refuse`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user),
        });

        transmit.broadcast(`notification/play/game/${game.frontId}/${targetPlayer.frontId}/peace/refuse`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user),
        });

        return response.send({
            message: `Peace proposal from ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)} refused`,
        });
    }

    public async cancelPendingPeace({ request, response, user, player, game, language }: HttpContext): Promise<void> {
        const { playerId } = await cancelPendingPeaceParamsValidator.validate(request.params());

        if (player.frontId === playerId) {
            return response.forbidden({ error: "You can't cancel a peace with yourself" });
        }

        const targetPlayer: RoomPlayer | undefined = game.room.players.find((loopPlayer: RoomPlayer): boolean => loopPlayer.frontId === playerId);
        if (!targetPlayer) {
            return response.notFound({ error: 'Target player not found' });
        } else if (!player.wars.find((war: War): boolean => war.enemyId === targetPlayer.id)) {
            return response.forbidden({ error: 'You are not at war' });
        } else if (!player.sentPendingPeaces.find((pendingPeace: PendingPeace): boolean => pendingPeace.enemyId === targetPlayer.id)) {
            return response.forbidden({ error: 'You did not asked peace with this player' });
        }

        await this.pendingPeaceRepository.removeByPlayers(player, targetPlayer);

        (player.sentPendingPeaces as unknown as PendingPeace[]) = player.sentPendingPeaces.filter((pendingPeace: PendingPeace): boolean => pendingPeace.enemyId !== targetPlayer.id);
        (targetPlayer.receivedPendingPeaces as unknown as PendingPeace[]) = targetPlayer.receivedPendingPeaces.filter((pendingPeace: PendingPeace): boolean => pendingPeace.playerId !== player.id);

        transmit.broadcast(`notification/play/game/${game.frontId}/${player.frontId}/peace/cancel`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user),
        });

        transmit.broadcast(`notification/play/game/${game.frontId}/${targetPlayer.frontId}/peace/cancel`, {
            player: player.apiSerialize(language, user),
            targetPlayer: targetPlayer.apiSerialize(language, user),
        });

        return response.send({
            message: `Peace proposal from ${targetPlayer.user?.username || targetPlayer.bot?.translate(language)} cancelled`,
        });
    }
}
