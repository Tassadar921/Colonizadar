import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import PlayableCountry from '#models/playable_country';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';
import { getAllPlayableCountriesValidator } from '#validators/playable_country';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';
import cache from '@adonisjs/cache/services/main';

@inject()
export default class PlayableCountryController {
    constructor(
        private readonly mapRepository: MapRepository,
        private readonly playableCountryRepository: PlayableCountryRepository
    ) {}

    public async getAll({ request, response, language }: HttpContext): Promise<void> {
        const { mapId } = await getAllPlayableCountriesValidator.validate(request.params());

        return response.send(
            await cache.getOrSet({
                key: `map-playable-countries:${mapId}`,
                ttl: '5m',
                factory: async (): Promise<SerializedPlayableCountry[]> => {
                    const map: Map = await this.mapRepository.firstOrFail({ frontId: mapId }, ['playableCountries']);
                    const playableCountries: PlayableCountry[] = await this.playableCountryRepository.getAllFromMapForRoom(map);
                    return playableCountries.map((playableCountry: PlayableCountry): SerializedPlayableCountry => playableCountry.apiSerialize(language));
                },
            })
        );
    }
}
