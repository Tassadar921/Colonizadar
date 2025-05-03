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
    declare infantryAttackFactor: number;

    @column()
    declare infantryDefenseFactor: number;

    @column()
    declare infantryPriceFactor: number;

    @column()
    declare shipAttackFactor: number;

    @column()
    declare shipDefenseFactor: number;

    @column()
    declare shipPriceFactor: number;

    @column()
    declare landingAttackFactor: number;

    @column()
    declare landingDefenseFactor: number;

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
            infantryAttackFactor: this.infantryAttackFactor,
            infantryDefenseFactor: this.infantryDefenseFactor,
            infantryPriceFactor: this.infantryPriceFactor,
            shipAttackFactor: this.shipAttackFactor,
            shipDefenseFactor: this.shipDefenseFactor,
            shipPriceFactor: this.shipPriceFactor,
            landingAttackFactor: this.landingAttackFactor,
            landingDefenseFactor: this.landingDefenseFactor,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
