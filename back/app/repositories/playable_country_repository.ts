import BaseRepository from '#repositories/base/base_repository';
import PlayableCountry from '#models/playable_country';
import Map from '#models/map';

export default class PlayableCountryRepository extends BaseRepository<typeof PlayableCountry> {
    constructor() {
        super(PlayableCountry);
    }

    public async getAllFromMapForSeeder(map: Map): Promise<Record<string, PlayableCountry>> {
        const countries: PlayableCountry[] = await this.Model.query().where('map_id', map.id);

        return countries.reduce(
            (acc: Record<string, PlayableCountry>, country: PlayableCountry): Record<string, PlayableCountry> => {
                acc[country.code] = country;
                return acc;
            },
            {} as Record<string, PlayableCountry>
        );
    }

    public async getAllFromMapForRoom(map: Map): Promise<PlayableCountry[]> {
        return this.Model.query().where('map_id', map.id);
    }
}
