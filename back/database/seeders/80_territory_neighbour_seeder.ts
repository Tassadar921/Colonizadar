import { BaseSeeder } from '@adonisjs/lucid/seeders';
import TerritoryRepository from '#repositories/territory_repository';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const territoryRepository: TerritoryRepository = new TerritoryRepository();
        const mapRepository: MapRepository = new MapRepository();

        const worldMap: Map | null = await mapRepository.findOneBy({ name: 'World Map' });
        if (!worldMap) {
            console.error('World map not found');
            return;
        }

        const neighbourhoods: { territoryCode: string; neighbourCode: string }[] = [
            // ********** North America **********
            // ***** Alaska *****
            { territoryCode: 'AL', neighbourCode: 'BC' },
            // ***** British Columbia *****
            { territoryCode: 'BC', neighbourCode: 'AL' },
            { territoryCode: 'BC', neighbourCode: 'NT' },
            { territoryCode: 'BC', neighbourCode: 'CA' },
            // ***** Northwest Territories *****
            { territoryCode: 'NT', neighbourCode: 'BC' },
            { territoryCode: 'NT', neighbourCode: 'NU' },
            { territoryCode: 'NT', neighbourCode: 'CA' },
            { territoryCode: 'NT', neighbourCode: 'DA' },
            // ***** Nunavut *****
            { territoryCode: 'NU', neighbourCode: 'NT' },
            { territoryCode: 'NU', neighbourCode: 'ON' },
            { territoryCode: 'NU', neighbourCode: 'DA' },
            // ***** Southern Ontario *****
            { territoryCode: 'ON', neighbourCode: 'NT' },
            { territoryCode: 'ON', neighbourCode: 'NU' },
            { territoryCode: 'ON', neighbourCode: 'DA' },
            { territoryCode: 'ON', neighbourCode: 'NX' },
            { territoryCode: 'ON', neighbourCode: 'QC' },
            { territoryCode: 'ON', neighbourCode: 'FL' },
            // ***** Northern Ontario *****
            { territoryCode: 'NX', neighbourCode: 'ON' },
            { territoryCode: 'NX', neighbourCode: 'QC' },
            // ***** Quebec *****
            { territoryCode: 'QC', neighbourCode: 'ON' },
            { territoryCode: 'QC', neighbourCode: 'NX' },
            { territoryCode: 'QC', neighbourCode: 'FL' },
            // ***** California *****
            { territoryCode: 'CA', neighbourCode: 'BC' },
            { territoryCode: 'CA', neighbourCode: 'NT' },
            { territoryCode: 'CA', neighbourCode: 'DA' },
            { territoryCode: 'CA', neighbourCode: 'MX' },
            // ***** Dakota *****
            { territoryCode: 'DA', neighbourCode: 'NT' },
            { territoryCode: 'DA', neighbourCode: 'NU' },
            { territoryCode: 'DA', neighbourCode: 'ON' },
            { territoryCode: 'DA', neighbourCode: 'TX' },
            { territoryCode: 'DA', neighbourCode: 'CA' },
            // ***** Texas *****
            { territoryCode: 'TX', neighbourCode: 'MX' },
            { territoryCode: 'TX', neighbourCode: 'DA' },
            { territoryCode: 'TX', neighbourCode: 'FL' },
            // ***** Florida *****
            { territoryCode: 'FL', neighbourCode: 'QC' },
            { territoryCode: 'FL', neighbourCode: 'ON' },
            { territoryCode: 'FL', neighbourCode: 'TX' },
            // ***** Mexico *****
            { territoryCode: 'MX', neighbourCode: 'CA' },
            { territoryCode: 'MX', neighbourCode: 'TX' },
            { territoryCode: 'MX', neighbourCode: 'GT' },
            // ********** South America **********
            // ***** Guatemala *****
            { territoryCode: 'GT', neighbourCode: 'MX' },
            { territoryCode: 'GT', neighbourCode: 'HN' },
            // ***** Honduras *****
            { territoryCode: 'HN', neighbourCode: 'GT' },
            { territoryCode: 'HN', neighbourCode: 'NI' },
            // ***** Nicaragua *****
            { territoryCode: 'NI', neighbourCode: 'HN' },
            { territoryCode: 'NI', neighbourCode: 'CR' },
            // ***** Costa Rica *****
            { territoryCode: 'CR', neighbourCode: 'NI' },
            { territoryCode: 'CR', neighbourCode: 'PA' },
            // ***** Panama *****
            { territoryCode: 'PA', neighbourCode: 'CR' },
            { territoryCode: 'PA', neighbourCode: 'CO' },
            // ***** Colombia *****
            { territoryCode: 'CO', neighbourCode: 'VE' },
            { territoryCode: 'CO', neighbourCode: 'EC' },
            { territoryCode: 'CO', neighbourCode: 'PE' },
            // ***** Venezuela *****
            { territoryCode: 'VE', neighbourCode: 'CO' },
            { territoryCode: 'VE', neighbourCode: 'SR' },
            // ***** Suriname *****
            { territoryCode: 'SR', neighbourCode: 'VE' },
            { territoryCode: 'SR', neighbourCode: 'BR' },
            // ***** Ecuador *****
            { territoryCode: 'EC', neighbourCode: 'CO' },
            { territoryCode: 'EC', neighbourCode: 'PE' },
            // ***** Peru *****
            { territoryCode: 'PE', neighbourCode: 'CO' },
            { territoryCode: 'PE', neighbourCode: 'EC' },
            { territoryCode: 'PE', neighbourCode: 'CL' },
            { territoryCode: 'PE', neighbourCode: 'BO' },
            // ***** Chile *****
            { territoryCode: 'CL', neighbourCode: 'PE' },
            { territoryCode: 'CL', neighbourCode: 'BO' },
            // ***** Bolivia *****
            { territoryCode: 'BO', neighbourCode: 'PE' },
            { territoryCode: 'BO', neighbourCode: 'CL' },
            { territoryCode: 'BO', neighbourCode: 'PY' },
            { territoryCode: 'BO', neighbourCode: 'AR' },
            // ***** Paraguay *****
            { territoryCode: 'PY', neighbourCode: 'BO' },
            { territoryCode: 'PY', neighbourCode: 'AR' },
            { territoryCode: 'PY', neighbourCode: 'BR' },
            // ***** Argentina *****
            { territoryCode: 'AR', neighbourCode: 'BO' },
            { territoryCode: 'AR', neighbourCode: 'PY' },
            { territoryCode: 'AR', neighbourCode: 'BR' },
            { territoryCode: 'AR', neighbourCode: 'UY' },
            // ***** Uruguay *****
            { territoryCode: 'UY', neighbourCode: 'AR' },
            { territoryCode: 'UY', neighbourCode: 'BR' },
            // ***** Brazil *****
            { territoryCode: 'BR', neighbourCode: 'SR' },
            { territoryCode: 'BR', neighbourCode: 'PY' },
            { territoryCode: 'BR', neighbourCode: 'AR' },
            { territoryCode: 'BR', neighbourCode: 'UY' },
        ];
    }
}
