import BaseRepository from '#repositories/base/base_repository';
import GameTerritory from '#models/game_territory';
import Game from '#models/game';

export default class GameTerritoryRepository extends BaseRepository<typeof GameTerritory> {
    constructor() {
        super(GameTerritory);
    }

    public async findOneFromTerritoryId(territoryCode: string, game: Game): Promise<GameTerritory> {
        return this.Model.query()
            .select('game_territories.*')
            .leftJoin('territories', 'game_territories.territory_id', 'territories.id')
            .where('game_territories.game_id', game.id)
            .andWhere('territories.code', territoryCode)
            .preload('owner')
            .preload('territory', (territoryQuery): void => {
                territoryQuery.preload('neighbours', (neighboursQuery): void => {
                    neighboursQuery.preload('neighbour');
                });
            })
            .firstOrFail();
    }
}
