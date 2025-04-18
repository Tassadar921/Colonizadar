import BaseRepository from '#repositories/base/base_repository';
import Game from '#models/game';
import Room from '#models/room';
import Territory from '#models/territory';
import GameTerritory from '#models/game_territory';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from '#models/room_player';
import { rollTerritoryPower, rollTerritoryValue } from '#services/roll_territory_service';

export default class GameRepository extends BaseRepository<typeof Game> {
    constructor() {
        super(Game);
    }

    public async getFromFrontId(gameId: number): Promise<Game | null> {
        return this.Model.query()
            .select('games.*')
            .leftJoin('rooms', 'rooms.id', 'games.room_id')
            .where('rooms.status', RoomStatusEnum.PLAYING)
            .andWhere('games.front_id', gameId)
            .preload('room', (roomQuery): void => {
                roomQuery.preload('owner').preload('players', (playersQuery): void => {
                    playersQuery.preload('user').preload('bot').preload('country').preload('difficulty').orderBy('frontId');
                });
            })
            .preload('territories', (territoriesQuery): void => {
                territoriesQuery
                    .preload('owner', (ownerQuery): void => {
                        ownerQuery.preload('bot').preload('user').preload('country').preload('difficulty');
                    })
                    .preload('territory', (territoryQuery): void => {
                        territoryQuery.preload('neighbours', (neighboursQuery): void => {
                            neighboursQuery.preload('neighbour');
                        });
                    });
            })
            .preload('map', (mapQuery): void => {
                mapQuery.preload('createdBy');
            })
            .first();
    }

    public async create(room: Room): Promise<Game> {
        const game: Game = await this.Model.create({
            roomId: room.id,
            mapId: room.map.id,
        });
        await game.refresh();

        await Promise.all(
            room.map.territories.map(async (territory: Territory): Promise<GameTerritory> => {
                let owner: RoomPlayer | undefined = undefined;
                if (territory.defaultBelongsToId) {
                    owner = room.players.find((player: RoomPlayer): boolean => player.countryId === territory.defaultBelongsToId);
                }
                rollTerritoryPower(territory, rollTerritoryValue(territory));
                return await GameTerritory.create({
                    territoryId: territory.id,
                    gameId: game.id,
                    ownerId: owner?.id,
                    power: territory.defaultPower ?? 1000,
                    value: rollTerritoryValue(territory),
                });
            })
        );

        await game.refresh();

        return game;
    }
}
