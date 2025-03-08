import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import SerializedTerritory from '#types/serialized/serialized_territory';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Map from '#models/map';
import PlayableCountry from "#models/playable_country";

export default class Territory extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare code: string;

    @column()
    declare frenchName: string;

    @column()
    declare englishName: string;

    @column()
    declare isCoastal: boolean;

    @column()
    declare mapId: string;

    @belongsTo((): typeof Map => Map)
    declare map: BelongsTo<typeof Map>;

    @column()
    declare defaultBelongsToId: string;

    @belongsTo((): typeof PlayableCountry => PlayableCountry)
    declare defaultBelongsTo: BelongsTo<typeof PlayableCountry>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public translate(language: Language): string {
        switch (language.code) {
            case 'fr':
                return this.frenchName;
            case 'en':
                return this.englishName;
            default:
                return this.englishName;
        }
    }

    public apiSerialize(language: Language): SerializedTerritory {
        return {
            code: this.code,
            name: this.translate(language),
            isCoastal: this.isCoastal,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
