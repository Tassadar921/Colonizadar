import BaseRepository from '#repositories/base/base_repository';
import Game from '#models/game';
import Room from '#models/room';
import Territory from '#models/territory';
import GameTerritory from '#models/game_territory';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from '#models/room_player';
import { rollTerritoryPower, rollTerritoryValue } from '#services/roll_territory_service';
import PeaceStatusEnum from '#types/enum/peace_status_enum';
import WarStatusEnum from '#types/enum/war_status_enum';

export default class GameRepository extends BaseRepository<typeof Game> {
    constructor() {
        super(Game);
    }

    public async getFromFrontId(gameId: number): Promise<Game> {
        return this.Model.query()
            .select('games.*')
            .leftJoin('rooms', 'rooms.id', 'games.room_id')
            .where('rooms.status', RoomStatusEnum.PLAYING)
            .andWhere('games.front_id', gameId)
            .preload('room', (roomQuery): void => {
                roomQuery.preload('owner').preload('players', (playersQuery): void => {
                    playersQuery
                        .preload('user', (userQuery): void => {
                            userQuery.preload('profilePicture');
                        })
                        .preload('bot', (botQuery): void => {
                            botQuery.preload('picture');
                        })
                        .preload('country')
                        .preload('difficulty')
                        .preload('wars', (warsQuery): void => {
                            warsQuery.preload('enemy').where('status', WarStatusEnum.IN_PROGRESS);
                        })
                        .preload('sentPendingPeaces', (sentPendingPeacesQuery): void => {
                            sentPendingPeacesQuery.preload('enemy');
                        })
                        .preload('receivedPendingPeaces', (receivedPendingPeacesQuery): void => {
                            receivedPendingPeacesQuery.preload('player');
                        })
                        .preload('peaces', (peacesQuery): void => {
                            peacesQuery
                                .preload('enemy')
                                .preload('war', (warQuery): void => {
                                    warQuery.preload('enemy');
                                })
                                .where('status', PeaceStatusEnum.IN_PROGRESS);
                        })
                        .orderBy('frontId');
                });
            })
            .preload('territories', (territoriesQuery): void => {
                territoriesQuery.preload('owner').preload('territory', (territoryQuery): void => {
                    territoryQuery.preload('neighbours', (neighboursQuery): void => {
                        neighboursQuery.preload('neighbour');
                    });
                });
            })
            .preload('map', (mapQuery): void => {
                mapQuery.preload('createdBy');
            })
            .firstOrFail();
    }

    public async create(room: Room): Promise<Game> {
        const game: Game = await this.Model.create({
            roomId: room.id,
            mapId: room.map.id,
        });
        await game.refresh();

        await Promise.all([
            ...room.map.territories.map(async (territory: Territory): Promise<GameTerritory> => {
                let owner: RoomPlayer | undefined = undefined;
                if (territory.defaultBelongsToId) {
                    owner = room.players.find((player: RoomPlayer): boolean => player.countryId === territory.defaultBelongsToId);
                }
                const value: number = rollTerritoryValue(territory);
                return await GameTerritory.create({
                    territoryId: territory.id,
                    gameId: game.id,
                    ownerId: owner?.id,
                    infantry: territory.defaultInfantry ?? rollTerritoryPower(territory, value),
                    ships: territory.defaultShips,
                    isFortified: territory.isFactory,
                    value,
                });
            }),
            ...room.players.map(async (player: RoomPlayer): Promise<RoomPlayer> => {
                player.isReady = false;
                player.gold = room.map.startingPlayersGold;
                return await player.save();
            }),
        ]);

        await game.refresh();

        return game;
    }
}
