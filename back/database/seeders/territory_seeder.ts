import { BaseSeeder } from '@adonisjs/lucid/seeders';
import TerritoryRepository from '#repositories/territory_repository';
import Territory from '#models/territory';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const territoryRepository: TerritoryRepository = new TerritoryRepository();

        const territories: { french: string; english: string; code: string }[] = [];

        for (const territory of territories) {
            if (!(await territoryRepository.findOneBy({ code: territory.code }))) {
                await Territory.create({
                    frenchName: territory.french,
                    englishName: territory.english,
                    code: territory.code,
                });
                console.log(`Territory ${territory.code} created`);
            }
        }
    }
}
