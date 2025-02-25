import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import PlayableCountry from '#models/playable_country';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';

@inject()
export default class BlockedController {
    constructor(private readonly playableCountryRepository: PlayableCountryRepository) {}

    public async getAll({ response, language }: HttpContext): Promise<void> {
        const playableCountries: PlayableCountry[] = await this.playableCountryRepository.all(['flag']);
        response.send(playableCountries.map((playableCountry: PlayableCountry): SerializedPlayableCountry => playableCountry.apiSerialize(language)));
    }
}
