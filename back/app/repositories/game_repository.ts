import BaseRepository from '#repositories/base/base_repository';
import Game from '#models/game';
import Room from '#models/room';
import Map from '#models/map';
import Territory from '#models/territory';
import GameTerritory from '#models/game_territory';

export default class GameRepository extends BaseRepository<typeof Game> {
    constructor() {
        super(Game);
    }

    public async getFromFrontId(gameId: number): Promise<Game | null> {
        return this.Model.query()
            .andWhere('front_id', gameId)
            .preload('room', (roomQuery): void => {
                roomQuery.preload('owner').preload('players', (playersQuery): void => {
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

    public async create(room: Room, map: Map): Promise<Game> {
        const game: Game = await this.Model.create({
            roomId: room.id,
            mapId: map.id,
        });
        await game.refresh();

        await Promise.all(
            map.territories.map(
                (territory: Territory): Promise<GameTerritory> =>
                    GameTerritory.create({
                        territoryId: territory.id,
                    })
            )
        );

        return game;
    }
}
