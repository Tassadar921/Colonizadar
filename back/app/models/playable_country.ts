import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';
import File from '#models/file';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Map from '#models/map';
import { translation, Translation } from '@stouder-io/adonis-translatable';

export default class PlayableCountry extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare code: string;

    @translation()
    declare name: Translation;

    @column()
    declare color: string;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare infantryAttackFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare infantryDefenseFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare infantryPriceFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare shipAttackFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare shipDefenseFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare shipPriceFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare landingAttackFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
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

    public apiSerialize(language: Language): SerializedPlayableCountry {
        return {
            id: this.frontId,
            name: this.name.get(language.code) ?? this.name.get('en') ?? '',
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
