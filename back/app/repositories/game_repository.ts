import BaseRepository from '#repositories/base/base_repository';
import Game from '#models/game';
import Room from '#models/room';
import Territory from '#models/territory';
import GameTerritory from '#models/game_territory';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from '#models/room_player';

export default class GameRepository extends BaseRepository<typeof Game> {
    constructor() {
        super(Game);
    }

    public async getFromFrontId(gameId: number): Promise<Game | null> {
        return this.Model.query()
            .select('games.*')
            .leftJoin('rooms', 'games.id', 'rooms.game_id')
            .where('rooms.status', RoomStatusEnum.PLAYING)
            .where('front_id', gameId)
            .preload('room', (roomQuery): void => {
                roomQuery.preload('players', (playersQuery): void => {
                    playersQuery
                        .preload('user', (userQuery): void => {
                            userQuery.preload('profilePicture');
                        })
                        .preload('bot', (botQuery): void => {
                            botQuery.preload('picture');
                        })
                        .preload('country', (countryQuery): void => {
                            countryQuery.preload('flag');
                        })
                        .preload('difficulty')
                        .orderBy('frontId');
                });
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
                    if (!owner) {
                        throw new Error(`Room player ${territory.defaultBelongsToId} not found`);
                    }
                }
                return await GameTerritory.create({
                    territoryId: territory.id,
                    gameId: game.id,
                });
            })
        );

        await game.refresh();

        return game;
    }
}
