import { BaseSeeder } from '@adonisjs/lucid/seeders';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import PlayableCountry from '#models/playable_country';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import FileService from '#services/file_service';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const playableCountryRepository: PlayableCountryRepository = new PlayableCountryRepository();
        const fileService: FileService = new FileService();
        const mapRepository: MapRepository = new MapRepository();

        const worldMap: Map | null = await mapRepository.findOneBy({ name: 'World Map' });
        if (!worldMap) {
            console.error('World map not found');
            return;
        }

        const playableCountries: { french: string; english: string; color: string; flagFileName: string; map: Map }[] = [
            { french: 'États-Unis', english: 'United States', color: '#0dcfff', flagFileName: 'us.svg', map: worldMap },
            { french: 'Royaume-Uni', english: 'United Kingdom', color: '#ff0d0d', flagFileName: 'uk.svg', map: worldMap },
            { french: 'Empire Allemand', english: 'German Empire', color: '#818181', flagFileName: 'de.svg', map: worldMap },
            { french: 'France', english: 'France', color: '#001fd6', flagFileName: 'fr.svg', map: worldMap },
            { french: 'Russie', english: 'Russia', color: '#0a7510', flagFileName: 'ru.svg', map: worldMap },
            { french: 'Japon', english: 'Japan', color: '#fdbb47', flagFileName: 'jp.svg', map: worldMap },
        ];

        for (const country of playableCountries) {
            if (!(await playableCountryRepository.findOneBy({ englishName: country.english, mapId: country.map.id }))) {
                const path: string = `static/world-map/country-flag/${country.flagFileName}`;
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
                    color: country.color,
                    flagId: flag.id,
                    mapId: country.map.id,
                });
                console.log(`Playable country ${country.english} created`);
            }
        }
    }
}
