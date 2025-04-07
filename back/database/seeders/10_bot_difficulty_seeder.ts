import { BaseSeeder } from '@adonisjs/lucid/seeders';
import BotDifficultyRepository from '#repositories/bot_difficulty_repository';
import BotDifficulty from '#models/bot_difficulty';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botDifficultyRepository: BotDifficultyRepository = new BotDifficultyRepository();

        const difficulties: { french: string; english: string }[] = [
            { french: 'Passif', english: 'Passive' },
            { french: 'Facile', english: 'Easy' },
            { french: 'Moyen', english: 'Medium' },
            { french: 'Difficile', english: 'Hard' },
            { french: 'Expert', english: 'Expert' },
        ];

        for (const difficulty of difficulties) {
            if (!(await botDifficultyRepository.findOneBy({ englishName: difficulty.english }))) {
                await BotDifficulty.create({
                    frenchName: difficulty.french,
                    englishName: difficulty.english,
                });
                console.log(`Difficulty ${difficulty.english} created`);
            }
        }
    }
}
