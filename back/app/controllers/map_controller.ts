import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import Map from '#models/map';
import MapRepository from '#repositories/map_repository';
import SerializedMap from '#types/serialized/serialized_map';
import cache from '@adonisjs/cache/services/main';

@inject()
export default class MapController {
    constructor(private readonly mapRepository: MapRepository) {}

    public async getAll({ response, language }: HttpContext): Promise<void> {
        return response.send(
            await cache.getOrSet({
                key: 'maps',
                ttl: '24h',
                factory: async (): Promise<SerializedMap[]> => {
                    const maps: Map[] = await this.mapRepository.all(['territories', 'createdBy']);
                    return await Promise.all(maps.map(async (map: Map): Promise<SerializedMap> => map.apiSerialize(language)));
                },
            })
        );
    }
}
