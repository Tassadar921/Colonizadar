import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import Map from '#models/map';
import MapRepository from "#repositories/map_repository";
import SerializedMap from "#types/serialized/serialized_map";

@inject()
export default class MapController {
    constructor(private readonly mapRepository: MapRepository) {}

    public async getAll({ response, language }: HttpContext): Promise<void> {
        const maps: Map[] = await this.mapRepository.all(['territories', 'createdBy']);
        response.send(await Promise.all(maps.map(async (map: Map): Promise<SerializedMap> => map.apiSerialize(language))));
    }
}
