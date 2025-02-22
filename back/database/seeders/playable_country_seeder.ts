import { BaseSeeder } from '@adonisjs/lucid/seeders';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import PlayableCountry from '#models/playable_country';
import app from "@adonisjs/core/services/app";
import File from "#models/file";
import FileService from "#services/file_service";

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const playableCountryRepository: PlayableCountryRepository = new PlayableCountryRepository();
        const fileService: FileService = new FileService();

        const playableCountries: { french: string; english: string; flagFileName: string }[] = [
            { french: 'États-Unis', english: 'United States', flagFileName: 'us.svg' },
            { french: 'Royaume-Uni', english: 'United Kingdom', flagFileName: 'uk.svg' },
            { french: 'Allemagne', english: 'Germany', flagFileName: 'de.svg' },
            { french: 'France', english: 'France', flagFileName: 'fr.svg' },
            { french: 'Russie', english: 'Russia', flagFileName: 'ru.svg' },
            { french: 'Japon', english: 'Japan', flagFileName: 'jp.svg' },
        ];

        for (const country of playableCountries) {
            if (!(await playableCountryRepository.findOneBy({ englishName: country.english }))) {
                const path: string = `static/country-flag/${country.flagFileName}`;
                const { size, mimeType, extension, name } = await fileService.getFileInfo(app.makePath(path));
                const flag: File | null = await File.create({
                    name,
                    path,
                    extension,
                    mimeType,
                    size,
                });
                await flag.refresh();

                await PlayableCountry.create({
                    frenchName: country.french,
                    englishName: country.english,
                    flagId: flag.id,
                });
                console.log(`Playable country ${country.english} created`);
            }
        }
    }
}
