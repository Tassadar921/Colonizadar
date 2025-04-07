import BaseRepository from '#repositories/base/base_repository';
import TerritoryNeighbour from "#models/territory_neighbour";

export default class TerritoryNeighbourRepository extends BaseRepository<typeof TerritoryNeighbour> {
    constructor() {
        super(TerritoryNeighbour);
    }
}
