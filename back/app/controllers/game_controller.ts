import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import Map from '#models/map';
import MapRepository from '#repositories/map_repository';
import SerializedMap from '#types/serialized/serialized_map';

@inject()
export default class MapController {
    constructor(private readonly mapRepository: MapRepository) {}

    public async get({ response, language, game }: HttpContext): Promise<void> {
        console.log(game);
    }
}
