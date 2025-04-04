import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import PlayableCountry from '#models/playable_country';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';
import { getAllPlayableCountriesValidator } from '#validators/playable_country';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';

@inject()
export default class MapController {
    constructor(
        private readonly mapRepository: MapRepository,
        private readonly playableCountryRepository: PlayableCountryRepository
    ) {}

    public async getAll({ request, response, language }: HttpContext): Promise<void> {
        const { mapId } = await getAllPlayableCountriesValidator.validate(request.params());

        const map: Map | null = await this.mapRepository.findOneBy({ frontId: mapId });
        if (!map) {
            response.notFound({ error: 'Map not found' });
            return;
        }

        const playableCountries: PlayableCountry[] = await this.playableCountryRepository.getAllFromMapForRoom(map);
        response.send(playableCountries.map((playableCountry: PlayableCountry): SerializedPlayableCountry => playableCountry.apiSerialize(language)));
    }
}
