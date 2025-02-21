import BaseRepository from '#repositories/base/base_repository';
import PlayableCountry from '#models/playable_country';

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
}
