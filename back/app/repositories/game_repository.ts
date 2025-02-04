import BaseRepository from '#repositories/base/base_repository';
import Game from '#models/game';

export default class GameRepository extends BaseRepository<typeof Game> {
    constructor() {
        super(Game);
    }
}
