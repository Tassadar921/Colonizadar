import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import cache from '@adonisjs/cache/services/main';
import BotDifficulty from '#models/bot_difficulty';
import SerializedBotDifficulty from '#types/serialized/serialized_bot_difficulty';
import BotDifficultyRepository from '#repositories/bot_difficulty_repository';

@inject()
export default class BotDifficultyController {
    constructor(private readonly botDifficultyRepository: BotDifficultyRepository) {}

    public async getAll({ response, language }: HttpContext): Promise<void> {
        return response.send({
            difficulties: await cache.getOrSet({
                key: 'bot-difficulties',
                ttl: '24h',
                factory: async (): Promise<SerializedBotDifficulty[]> => {
                    const difficulties: BotDifficulty[] = await this.botDifficultyRepository.all();
                    return difficulties.map((difficulty: BotDifficulty): SerializedBotDifficulty => difficulty.apiSerialize(language));
                },
            }),
        });
    }
}
