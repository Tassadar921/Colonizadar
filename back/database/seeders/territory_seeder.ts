import { BaseSeeder } from '@adonisjs/lucid/seeders';
import TerritoryRepository from '#repositories/territory_repository';
import Territory from '#models/territory';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const territoryRepository: TerritoryRepository = new TerritoryRepository();

        const territories: { code: string; french: string; english: string; isCoastal: boolean }[] = [
            { code: 'AL', french: 'Alaska', english: 'Alaska', isCoastal: true },
            { code: 'BC', french: 'Colombie-Britannique', english: 'British Columbia', isCoastal: true },
            { code: 'NT', french: 'Territoires du Nord-Ouest', english: 'Northwest Territories', isCoastal: true },
            { code: 'NU', french: 'Nunavut', english: 'Nunavut', isCoastal: true },
            { code: 'NO', french: 'Ontario du nord', english: 'Northern Ontario', isCoastal: true },
            { code: 'SO', french: 'Ontario du sud', english: 'Southern Ontario', isCoastal: false },
            { code: 'QC', french: 'Québec', english: 'Quebec', isCoastal: true },
        ];

        for (const territory of territories) {
            if (!(await territoryRepository.findOneBy({ code: territory.code }))) {
                await Territory.create({
                    frenchName: territory.french,
                    englishName: territory.english,
                    code: territory.code,
                    isCoastal: territory.isCoastal,
                });
                console.log(`Territory ${territory.code} created`);
            }
        }
    }
}
