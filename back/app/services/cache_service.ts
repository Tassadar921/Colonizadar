import cache from '@adonisjs/cache/services/main';
import { LucidModel, LucidRow, ModelAttributes } from '@adonisjs/lucid/types/model';

export default class CacheService {
    async get<T extends LucidRow>(
        key: string,
        factory: () => Promise<Partial<ModelAttributes<T>> | null>,
        time: string = '5m',
        model?: LucidModel & { new (): T }
    ): Promise<T | Partial<ModelAttributes<T>> | null> {
        const cachedObject = await cache.getOrSet({
            key,
            factory,
            ttl: time,
        });

        if (cachedObject && model) {
            const modelInstance = new model() as T;
            modelInstance.fill(cachedObject as Partial<ModelAttributes<T>>);
            return modelInstance;
        }

        return cachedObject;
    }
}
