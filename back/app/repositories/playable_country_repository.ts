import BaseRepository from '#repositories/base/base_repository';
import PlayableCountry from '#models/playable_country';
import Map from '#models/map';

export default class PlayableCountryRepository extends BaseRepository<typeof PlayableCountry> {
    constructor() {
        super(PlayableCountry);
    }

    public async getFirst(): Promise<PlayableCountry> {
        const country: PlayableCountry | null = await this.Model.query().first();
        if (!country) {
            throw new Error('No playable country found');
        }
        return country;
    }

    public async getAllFromMap(map: Map) {
        switch (map.name) {
            case 'World Map':
                return {
                    us: await this.Model.query().where('map_id', map.id).where('english_name', 'United States').firstOrFail(),
                    gb: await this.Model.query().where('map_id', map.id).where('english_name', 'United Kingdom').firstOrFail(),
                    fr: await this.Model.query().where('map_id', map.id).where('english_name', 'France').firstOrFail(),
                    de: await this.Model.query().where('map_id', map.id).where('english_name', 'German Empire').firstOrFail(),
                    ru: await this.Model.query().where('map_id', map.id).where('english_name', 'Russia').firstOrFail(),
                    jp: await this.Model.query().where('map_id', map.id).where('english_name', 'Japan').firstOrFail(),
                };
        }
    }
}
