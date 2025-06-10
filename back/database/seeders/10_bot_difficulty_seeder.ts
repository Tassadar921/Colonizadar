import { BaseSeeder } from '@adonisjs/lucid/seeders';
import BotDifficultyRepository from '#repositories/bot_difficulty_repository';
import BotDifficulty from '#models/bot_difficulty';
import { Translation } from '@stouder-io/adonis-translatable';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botDifficultyRepository: BotDifficultyRepository = new BotDifficultyRepository();

        const difficulties: { order: number; french: string; english: string; isDefault?: boolean }[] = [
            { order: 0, french: 'Passif', english: 'Passive' },
            { order: 1, french: 'Facile', english: 'Easy' },
            { order: 2, french: 'Moyen', english: 'Medium', isDefault: true },
            { order: 3, french: 'Difficile', english: 'Hard' },
            { order: 4, french: 'Expert', english: 'Expert' },
        ];

        for (const difficulty of difficulties) {
            if (!(await botDifficultyRepository.findOneBy({ order: difficulty.order }))) {
                await BotDifficulty.create({
                    order: difficulty.order,
                    name: Translation.from({
                        fr: difficulty.french,
                        en: difficulty.english,
                    }),
                    isDefault: difficulty.isDefault ?? false,
                });
            }
        }
    }
}
