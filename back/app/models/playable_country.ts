import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';
import File from '#models/file';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Map from '#models/map';

export default class PlayableCountry extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare frenchName: string;

    @column()
    declare englishName: string;

    @column()
    declare color: string;

    @column()
    declare infantryAttack: number;

    @column()
    declare infantryDefense: number;

    @column()
    declare infantryPrice: number;

    @column()
    declare shipAttack: number;

    @column()
    declare shipDefense: number;

    @column()
    declare shipPrice: number;

    @column()
    declare landingAttack: number;

    @column()
    declare landingDefense: number;

    @column()
    declare flagId: string | null;

    @belongsTo((): typeof File => File, {
        foreignKey: 'flagId',
    })
    declare flag: BelongsTo<typeof File>;

    @column()
    declare mapId: string;

    @belongsTo((): typeof Map => Map)
    declare map: BelongsTo<typeof Map>;

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

    public apiSerialize(language: Language): SerializedPlayableCountry {
        return {
            id: this.frontId,
            name: this.translate(language),
            color: this.color,
            infantryAttack: this.infantryAttack,
            infantryDefense: this.infantryDefense,
            infantryPrice: this.infantryPrice,
            shipAttack: this.shipAttack,
            shipDefense: this.shipDefense,
            shipPrice: this.shipPrice,
            landingAttack: this.landingAttack,
            landingDefense: this.landingDefense,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
