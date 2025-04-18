import { BaseSeeder } from '@adonisjs/lucid/seeders';
import TerritoryRepository from '#repositories/territory_repository';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';
import Territory from '#models/territory';
import TerritoryNeighbourRepository from '#repositories/territory_neighbour_repository';
import TerritoryNeighbour from '#models/territory_neighbour';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const territoryRepository: TerritoryRepository = new TerritoryRepository();
        const mapRepository: MapRepository = new MapRepository();
        const territoryNeighbourRepository: TerritoryNeighbourRepository = new TerritoryNeighbourRepository();

        const worldMap: Map | null = await mapRepository.findOneBy({ name: 'World Map' });
        if (!worldMap) {
            console.error('World map not found');
            return;
        }

        const neighbourhoods: { territoryCode: string; neighbourCode: string }[] = [
            // ******************** North America ********************
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

            // ******************** South America ********************
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

            // ******************** Europe ********************
            // ***** Scotland *****
            { territoryCode: 'SN', neighbourCode: 'GB' },
            // ***** Great Britain *****
            { territoryCode: 'GB', neighbourCode: 'SN' },
            // ***** Portugal *****
            { territoryCode: 'PT', neighbourCode: 'ES' },
            // ***** Spain *****
            { territoryCode: 'ES', neighbourCode: 'PT' },
            { territoryCode: 'ES', neighbourCode: 'SF' },
            // ***** Southern France *****
            { territoryCode: 'SF', neighbourCode: 'ES' },
            { territoryCode: 'SF', neighbourCode: 'MF' },
            { territoryCode: 'SF', neighbourCode: 'IT' },
            // ***** Middle France *****
            { territoryCode: 'MF', neighbourCode: 'NF' },
            { territoryCode: 'MF', neighbourCode: 'NL' },
            { territoryCode: 'MF', neighbourCode: 'RH' },
            { territoryCode: 'MF', neighbourCode: 'SF' },
            // ***** Northern France *****
            { territoryCode: 'NF', neighbourCode: 'NL' },
            { territoryCode: 'NF', neighbourCode: 'MF' },
            // ***** Netherlands *****
            { territoryCode: 'NL', neighbourCode: 'NF' },
            { territoryCode: 'NL', neighbourCode: 'MF' },
            { territoryCode: 'NL', neighbourCode: 'RH' },
            { territoryCode: 'NL', neighbourCode: 'SX' },
            // ***** Rhine  *****
            { territoryCode: 'RH', neighbourCode: 'NL' },
            { territoryCode: 'RH', neighbourCode: 'SX' },
            { territoryCode: 'RH', neighbourCode: 'AT' },
            { territoryCode: 'RH', neighbourCode: 'MF' },
            // ***** Italia  *****
            { territoryCode: 'IT', neighbourCode: 'SF' },
            { territoryCode: 'IT', neighbourCode: 'AT' },
            // ***** Austria  *****
            { territoryCode: 'AT', neighbourCode: 'IT' },
            { territoryCode: 'AT', neighbourCode: 'RH' },
            { territoryCode: 'AT', neighbourCode: 'SX' },
            { territoryCode: 'AT', neighbourCode: 'UR' },
            { territoryCode: 'AT', neighbourCode: 'RO' },
            { territoryCode: 'AT', neighbourCode: 'BG' },
            // ***** Saxony  *****
            { territoryCode: 'SX', neighbourCode: 'RH' },
            { territoryCode: 'SX', neighbourCode: 'NL' },
            { territoryCode: 'SX', neighbourCode: 'DK' },
            { territoryCode: 'SX', neighbourCode: 'PS' },
            { territoryCode: 'SX', neighbourCode: 'UR' },
            { territoryCode: 'SX', neighbourCode: 'AT' },
            // ***** Prussia  *****
            { territoryCode: 'PS', neighbourCode: 'SX' },
            { territoryCode: 'PS', neighbourCode: 'UR' },
            // ***** Ural  *****
            { territoryCode: 'UR', neighbourCode: 'NO' },
            { territoryCode: 'UR', neighbourCode: 'FI' },
            { territoryCode: 'UR', neighbourCode: 'SW' },
            { territoryCode: 'UR', neighbourCode: 'RO' },
            { territoryCode: 'UR', neighbourCode: 'AT' },
            { territoryCode: 'UR', neighbourCode: 'SX' },
            { territoryCode: 'UR', neighbourCode: 'PS' },
            // ***** Denmark  *****
            { territoryCode: 'DK', neighbourCode: 'SX' },
            // ***** Sweden  *****
            { territoryCode: 'SE', neighbourCode: 'NO' },
            { territoryCode: 'SE', neighbourCode: 'FI' },
            // ***** Norway  *****
            { territoryCode: 'NO', neighbourCode: 'SE' },
            { territoryCode: 'NO', neighbourCode: 'FI' },
            { territoryCode: 'NO', neighbourCode: 'UR' },
            // ***** Finland  *****
            { territoryCode: 'FI', neighbourCode: 'NO' },
            { territoryCode: 'FI', neighbourCode: 'SE' },
            { territoryCode: 'FI', neighbourCode: 'UR' },
            // ***** Romania  *****
            { territoryCode: 'RO', neighbourCode: 'UR' },
            { territoryCode: 'RO', neighbourCode: 'BG' },
            { territoryCode: 'RO', neighbourCode: 'AT' },
            // ***** Bulgaria  *****
            { territoryCode: 'BG', neighbourCode: 'AT' },
            { territoryCode: 'BG', neighbourCode: 'RO' },
            { territoryCode: 'BG', neighbourCode: 'GR' },
            { territoryCode: 'BG', neighbourCode: 'TR' },
            // ***** Greece  *****
            { territoryCode: 'GR', neighbourCode: 'BG' },
            { territoryCode: 'GR', neighbourCode: 'TR' },

            // ******************** Africa ********************
            // ***** Morocco  *****
            { territoryCode: 'MA', neighbourCode: 'DZ' },
            { territoryCode: 'MA', neighbourCode: 'MR' },
            // ***** Algeria  *****
            { territoryCode: 'DZ', neighbourCode: 'MA' },
            { territoryCode: 'DZ', neighbourCode: 'MR' },
            { territoryCode: 'DZ', neighbourCode: 'ML' },
            { territoryCode: 'DZ', neighbourCode: 'NE' },
            { territoryCode: 'DZ', neighbourCode: 'LY' },
            { territoryCode: 'DZ', neighbourCode: 'TN' },
            // ***** Tunisia  *****
            { territoryCode: 'TN', neighbourCode: 'DZ' },
            { territoryCode: 'TN', neighbourCode: 'LY' },
            // ***** Libya  *****
            { territoryCode: 'LY', neighbourCode: 'TN' },
            { territoryCode: 'LY', neighbourCode: 'DZ' },
            { territoryCode: 'LY', neighbourCode: 'NE' },
            { territoryCode: 'LY', neighbourCode: 'EG' },
            // ***** Egypt  *****
            { territoryCode: 'EG', neighbourCode: 'LY' },
            { territoryCode: 'EG', neighbourCode: 'JO' },
            { territoryCode: 'EG', neighbourCode: 'SD' },
            // ***** Mauritania  *****
            { territoryCode: 'MR', neighbourCode: 'MA' },
            { territoryCode: 'MR', neighbourCode: 'DZ' },
            { territoryCode: 'MR', neighbourCode: 'ML' },
            { territoryCode: 'MR', neighbourCode: 'GN' },
            // ***** Guinea  *****
            { territoryCode: 'GN', neighbourCode: 'MR' },
            { territoryCode: 'GN', neighbourCode: 'ML' },
            { territoryCode: 'GN', neighbourCode: 'CI' },
            // ***** Mali  *****
            { territoryCode: 'ML', neighbourCode: 'DZ' },
            { territoryCode: 'ML', neighbourCode: 'MR' },
            { territoryCode: 'ML', neighbourCode: 'GN' },
            { territoryCode: 'ML', neighbourCode: 'CI' },
            // ***** Côte d’Ivoire  *****
            { territoryCode: 'CI', neighbourCode: 'GN' },
            { territoryCode: 'CI', neighbourCode: 'ML' },
            { territoryCode: 'CI', neighbourCode: 'NE' },
            { territoryCode: 'CI', neighbourCode: 'NG' },
            // ***** Nigeria  *****
            { territoryCode: 'NG', neighbourCode: 'CI' },
            { territoryCode: 'NG', neighbourCode: 'NE' },
            { territoryCode: 'NG', neighbourCode: 'TD' },
            { territoryCode: 'NG', neighbourCode: 'CM' },
            // ***** Niger  *****
            { territoryCode: 'NE', neighbourCode: 'DZ' },
            { territoryCode: 'NE', neighbourCode: 'LY' },
            { territoryCode: 'NE', neighbourCode: 'TD' },
            { territoryCode: 'NE', neighbourCode: 'NG' },
            { territoryCode: 'NE', neighbourCode: 'CI' },
            // ***** Chad  *****
            { territoryCode: 'TD', neighbourCode: 'SD' },
            { territoryCode: 'TD', neighbourCode: 'CD' },
            { territoryCode: 'TD', neighbourCode: 'CM' },
            { territoryCode: 'TD', neighbourCode: 'NG' },
            { territoryCode: 'TD', neighbourCode: 'NE' },
            // ***** Sudan  *****
            { territoryCode: 'SD', neighbourCode: 'EG' },
            { territoryCode: 'SD', neighbourCode: 'SO' },
            { territoryCode: 'SD', neighbourCode: 'ET' },
            { territoryCode: 'SD', neighbourCode: 'KE' },
            { territoryCode: 'SD', neighbourCode: 'CD' },
            { territoryCode: 'SD', neighbourCode: 'TD' },
            // ***** Cameroon  *****
            { territoryCode: 'CM', neighbourCode: 'NG' },
            { territoryCode: 'CM', neighbourCode: 'TD' },
            { territoryCode: 'CM', neighbourCode: 'CD' },
            // ***** Congo  *****
            { territoryCode: 'CD', neighbourCode: 'CM' },
            { territoryCode: 'CD', neighbourCode: 'TD' },
            { territoryCode: 'CD', neighbourCode: 'SD' },
            { territoryCode: 'CD', neighbourCode: 'KE' },
            { territoryCode: 'CD', neighbourCode: 'AO' },
            // ***** Somalia  *****
            { territoryCode: 'SO', neighbourCode: 'SD' },
            { territoryCode: 'SO', neighbourCode: 'ET' },
            { territoryCode: 'SO', neighbourCode: 'KE' },
            // ***** Ethiopia  *****
            { territoryCode: 'ET', neighbourCode: 'SD' },
            { territoryCode: 'ET', neighbourCode: 'SO' },
            { territoryCode: 'ET', neighbourCode: 'KE' },
            // ***** Kenya  *****
            { territoryCode: 'KE', neighbourCode: 'CD' },
            { territoryCode: 'KE', neighbourCode: 'SD' },
            { territoryCode: 'KE', neighbourCode: 'ET' },
            { territoryCode: 'KE', neighbourCode: 'SO' },
            { territoryCode: 'KE', neighbourCode: 'TZ' },
            // ***** Tanzania  *****
            { territoryCode: 'TZ', neighbourCode: 'KE' },
            { territoryCode: 'TZ', neighbourCode: 'MZ' },
            // ***** Mozambique  *****
            { territoryCode: 'MZ', neighbourCode: 'TZ' },
            { territoryCode: 'MZ', neighbourCode: 'ZM' },
            { territoryCode: 'MZ', neighbourCode: 'BW' },
            { territoryCode: 'MZ', neighbourCode: 'ZA' },
            // ***** South Africa  *****
            { territoryCode: 'ZA', neighbourCode: 'NA' },
            { territoryCode: 'ZA', neighbourCode: 'BW' },
            { territoryCode: 'ZA', neighbourCode: 'MZ' },
            // ***** Botswana  *****
            { territoryCode: 'BW', neighbourCode: 'ZM' },
            { territoryCode: 'BW', neighbourCode: 'MZ' },
            { territoryCode: 'BW', neighbourCode: 'ZA' },
            { territoryCode: 'BW', neighbourCode: 'NA' },
            { territoryCode: 'BW', neighbourCode: 'AO' },
            // ***** Namibia  *****
            { territoryCode: 'NA', neighbourCode: 'AO' },
            { territoryCode: 'NA', neighbourCode: 'BW' },
            { territoryCode: 'NA', neighbourCode: 'ZA' },
            // ***** Zambia  *****
            { territoryCode: 'ZM', neighbourCode: 'MZ' },
            { territoryCode: 'ZM', neighbourCode: 'BW' },
            { territoryCode: 'ZM', neighbourCode: 'AO' },
            // ***** Angola  *****
            { territoryCode: 'AO', neighbourCode: 'CD' },
            { territoryCode: 'AO', neighbourCode: 'ZM' },
            { territoryCode: 'AO', neighbourCode: 'BW' },
            { territoryCode: 'AO', neighbourCode: 'NA' },

            // ******************** Middle East ********************
            // ***** Turkey  *****
            { territoryCode: 'TR', neighbourCode: 'GR' },
            { territoryCode: 'TR', neighbourCode: 'BG' },
            { territoryCode: 'TR', neighbourCode: 'SW' },
            { territoryCode: 'TR', neighbourCode: 'IR' },
            { territoryCode: 'TR', neighbourCode: 'IQ' },
            { territoryCode: 'TR', neighbourCode: 'SY' },
            // ***** Syria  *****
            { territoryCode: 'SY', neighbourCode: 'TR' },
            { territoryCode: 'SY', neighbourCode: 'IQ' },
            { territoryCode: 'SY', neighbourCode: 'JO' },
            // ***** Jordan  *****
            { territoryCode: 'JO', neighbourCode: 'SY' },
            { territoryCode: 'JO', neighbourCode: 'IQ' },
            { territoryCode: 'JO', neighbourCode: 'SA' },
            { territoryCode: 'JO', neighbourCode: 'EG' },
            // ***** Saudi Arabia  *****
            { territoryCode: 'SA', neighbourCode: 'JO' },
            { territoryCode: 'SA', neighbourCode: 'IQ' },
            { territoryCode: 'SA', neighbourCode: 'OM' },
            { territoryCode: 'SA', neighbourCode: 'YE' },
            // ***** Yemen  *****
            { territoryCode: 'YE', neighbourCode: 'SA' },
            { territoryCode: 'YE', neighbourCode: 'OM' },
            // ***** Oman  *****
            { territoryCode: 'OM', neighbourCode: 'SA' },
            { territoryCode: 'OM', neighbourCode: 'YE' },
            // ***** Iraq  *****
            { territoryCode: 'IQ', neighbourCode: 'TR' },
            { territoryCode: 'IQ', neighbourCode: 'IR' },
            { territoryCode: 'IQ', neighbourCode: 'SA' },
            { territoryCode: 'IQ', neighbourCode: 'JO' },
            { territoryCode: 'IQ', neighbourCode: 'SY' },

            // ******************** Asia ********************
            // ***** Western Siberia  *****
            { territoryCode: 'SW', neighbourCode: 'UR' },
            { territoryCode: 'SW', neighbourCode: 'CS' },
            { territoryCode: 'SW', neighbourCode: 'IR' },
            { territoryCode: 'SW', neighbourCode: 'TR' },
            // ***** Central Siberia  *****
            { territoryCode: 'CS', neighbourCode: 'SW' },
            { territoryCode: 'CS', neighbourCode: 'SI' },
            { territoryCode: 'CS', neighbourCode: 'AF' },
            // ***** Eastern Siberia  *****
            { territoryCode: 'SI', neighbourCode: 'CS' },
            { territoryCode: 'SI', neighbourCode: 'MC' },
            { territoryCode: 'SI', neighbourCode: 'MN' },
            // ***** Persia  *****
            { territoryCode: 'IR', neighbourCode: 'AF' },
            { territoryCode: 'IR', neighbourCode: 'WP' },
            { territoryCode: 'IR', neighbourCode: 'IQ' },
            { territoryCode: 'IR', neighbourCode: 'TR' },
            { territoryCode: 'IR', neighbourCode: 'SW' },
            // ***** Afghanistan  *****
            { territoryCode: 'AF', neighbourCode: 'CS' },
            { territoryCode: 'AF', neighbourCode: 'IR' },
            // ***** Western Pakistan  *****
            { territoryCode: 'WP', neighbourCode: 'IR' },
            { territoryCode: 'WP', neighbourCode: 'NK' },
            { territoryCode: 'WP', neighbourCode: 'EP' },
            // ***** Northern Pakistan  *****
            { territoryCode: 'NK', neighbourCode: 'WP' },
            { territoryCode: 'NK', neighbourCode: 'EP' },
            // ***** Eastern Pakistan  *****
            { territoryCode: 'EP', neighbourCode: 'WP' },
            { territoryCode: 'EP', neighbourCode: 'NK' },
            { territoryCode: 'EP', neighbourCode: 'UP' },
            { territoryCode: 'EP', neighbourCode: 'WI' },
            // ***** Western India  *****
            { territoryCode: 'WI', neighbourCode: 'EP' },
            { territoryCode: 'WI', neighbourCode: 'UP' },
            { territoryCode: 'WI', neighbourCode: 'EI' },
            { territoryCode: 'WI', neighbourCode: 'MI' },
            // ***** Central India  *****
            { territoryCode: 'MI', neighbourCode: 'WI' },
            { territoryCode: 'MI', neighbourCode: 'EI' },
            // ***** Eastern India  *****
            { territoryCode: 'EI', neighbourCode: 'MI' },
            { territoryCode: 'EI', neighbourCode: 'WI' },
            { territoryCode: 'EI', neighbourCode: 'UP' },
            { territoryCode: 'EI', neighbourCode: 'BD' },
            // ***** Uttar Pradesh  *****
            { territoryCode: 'UP', neighbourCode: 'NP' },
            { territoryCode: 'UP', neighbourCode: 'BD' },
            { territoryCode: 'UP', neighbourCode: 'EI' },
            { territoryCode: 'UP', neighbourCode: 'WI' },
            { territoryCode: 'UP', neighbourCode: 'EP' },
            // ***** Nepal  *****
            { territoryCode: 'NP', neighbourCode: 'UP' },
            // ***** Bangladesh  *****
            { territoryCode: 'BD', neighbourCode: 'EI' },
            { territoryCode: 'BD', neighbourCode: 'UP' },
            { territoryCode: 'BD', neighbourCode: 'BT' },
            { territoryCode: 'BD', neighbourCode: 'MM' },
            // ***** Bhutan  *****
            { territoryCode: 'BT', neighbourCode: 'MM' },
            { territoryCode: 'BT', neighbourCode: 'BD' },
            { territoryCode: 'BT', neighbourCode: 'UP' },
            // ***** Myanmar  *****
            { territoryCode: 'MM', neighbourCode: 'TH' },
            { territoryCode: 'MM', neighbourCode: 'BD' },
            { territoryCode: 'MM', neighbourCode: 'BT' },
            // ***** Thailand  *****
            { territoryCode: 'TH', neighbourCode: 'MM' },
            { territoryCode: 'TH', neighbourCode: 'VN' },
            { territoryCode: 'TH', neighbourCode: 'KH' },
            { territoryCode: 'TH', neighbourCode: 'MY' },
            // ***** Malaysia  *****
            { territoryCode: 'MY', neighbourCode: 'TH' },
            // ***** Cambodia  *****
            { territoryCode: 'KH', neighbourCode: 'TH' },
            { territoryCode: 'KH', neighbourCode: 'VN' },
            // ***** Vietnam  *****
            { territoryCode: 'VN', neighbourCode: 'YN' },
            { territoryCode: 'VN', neighbourCode: 'KH' },
            { territoryCode: 'VN', neighbourCode: 'TH' },
            // ***** Yunnan  *****
            { territoryCode: 'YN', neighbourCode: 'VN' },
            { territoryCode: 'YN', neighbourCode: 'TB' },
            { territoryCode: 'YN', neighbourCode: 'SH' },
            { territoryCode: 'YN', neighbourCode: 'SZ' },
            // ***** Shaanxi  *****
            { territoryCode: 'SH', neighbourCode: 'SH' },
            { territoryCode: 'SH', neighbourCode: 'YN' },
            { territoryCode: 'SH', neighbourCode: 'TB' },
            // ***** Shandong  *****
            { territoryCode: 'SZ', neighbourCode: 'ZH' },
            { territoryCode: 'SZ', neighbourCode: 'YN' },
            // ***** Tibet  *****
            { territoryCode: 'TB', neighbourCode: 'MN' },
            { territoryCode: 'TB', neighbourCode: 'SH' },
            { territoryCode: 'TB', neighbourCode: 'YN' },
            // ***** Mongolia  *****
            { territoryCode: 'MN', neighbourCode: 'SI' },
            { territoryCode: 'MN', neighbourCode: 'TB' },
            // ***** Zhili  *****
            { territoryCode: 'ZH', neighbourCode: 'MC' },
            { territoryCode: 'ZH', neighbourCode: 'SH' },
            { territoryCode: 'ZH', neighbourCode: 'SZ' },
            // ***** Manchuria  *****
            { territoryCode: 'MC', neighbourCode: 'SI' },
            { territoryCode: 'MC', neighbourCode: 'KO' },
            { territoryCode: 'MC', neighbourCode: 'ZH' },
            // ***** Korea  *****
            { territoryCode: 'KO', neighbourCode: 'MC' },
            // ***** Hokkaido  *****
            { territoryCode: 'HK', neighbourCode: 'HS' },
            // ***** Honshu  *****
            { territoryCode: 'HS', neighbourCode: 'HK' },

            // ******************** Oceania ********************
            // ***** Western Australia  *****
            { territoryCode: 'WA', neighbourCode: 'NT' },
            // ***** Northwest Territories  *****
            { territoryCode: 'NT', neighbourCode: 'WA' },
            { territoryCode: 'NT', neighbourCode: 'QL' },
            { territoryCode: 'NT', neighbourCode: 'NS' },
            // ***** Queensland  *****
            { territoryCode: 'QL', neighbourCode: 'NT' },
            { territoryCode: 'QL', neighbourCode: 'NS' },
            // ***** New South Wales  *****
            { territoryCode: 'NS', neighbourCode: 'NT' },
            { territoryCode: 'NS', neighbourCode: 'QL' },
        ];

        for (const neighbourhood of neighbourhoods) {
            const territory: Territory = await territoryRepository.firstOrFail({ code: neighbourhood.territoryCode });
            const neighbour: Territory = await territoryRepository.firstOrFail({ code: neighbourhood.neighbourCode });

            if (!(await territoryNeighbourRepository.findOneBy({ territoryId: territory.id, neighbourId: neighbour.id }))) {
                await TerritoryNeighbour.create({
                    territoryId: territory.id,
                    neighbourId: neighbour.id,
                });
            }
        }
    }
}
