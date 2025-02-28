import BaseRepository from '#repositories/base/base_repository';
import Game from '#models/game';

export default class GameRepository extends BaseRepository<typeof Game> {
    constructor() {
        super(Game);
    }

    public async getFromFrontId(gameId: number): Promise<Game | null> {
        return this.Model.query()
            .andWhere('front_id', gameId)
            .preload('room', (roomQuery): void => {
                roomQuery
                    .preload('owner')
                    .preload('players', (playersQuery): void => {
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
                    })
            })
            .first();
    }
}
