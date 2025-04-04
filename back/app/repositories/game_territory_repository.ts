import BaseRepository from '#repositories/base/base_repository';
import GameTerritory from '#models/game_territory';

export default class GameTerritoryRepository extends BaseRepository<typeof GameTerritory> {
    constructor() {
        super(GameTerritory);
    }
}
