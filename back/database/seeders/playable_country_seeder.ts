import { BaseSeeder } from '@adonisjs/lucid/seeders';
import PlayableCountryRepository from "#repositories/playable_country_repository";
import PlayableCountry from "#models/playable_country";

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const playableCountryRepository: PlayableCountryRepository = new PlayableCountryRepository();

        const playableCountries: { french: string; english: string }[] = [
            { french: 'États-Unis', english: 'United States' },
            { french: 'Royaume-Uni', english: 'United Kingdom' },
            { french: 'Allemagne', english: 'Germany' },
            { french: 'France', english: 'France' },
            { french: 'Russie', english: 'Russia' },
            { french: 'Japon', english: 'Japan' },
        ];

        for (const country of playableCountries) {
            if (!(await playableCountryRepository.findOneBy({ englishName: country.english }))) {

                await PlayableCountry.create({
                    frenchName: country.french,
                    englishName: country.english,
                });
                console.log(`Playable country ${country.english} created`);
            }
        }
    }
}
