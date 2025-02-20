import BaseRepository from '#repositories/base/base_repository';
import PlayableCountry from "#models/playable_country";

export default class PlayableCountryRepository extends BaseRepository<typeof PlayableCountry> {
    constructor() {
        super(PlayableCountry);
    }
}
