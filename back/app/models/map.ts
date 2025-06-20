import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import SerializedMap from '#types/serialized/serialized_map';
import Territory from '#models/territory';
import SerializedTerritory from '#types/serialized/serialized_territory';
import Language from '#models/language';
import File from '#models/file';
import SerializedMapLight from '#types/serialized/serialized_map_light';
import PlayableCountry from '#models/playable_country';
import { Translation, translation } from '@stouder-io/adonis-translatable';

export default class Map extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare code: string;

    @translation()
    declare name: Translation;

    @column()
    declare mainSeason: number;

    @column()
    declare startingPlayersGold: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare wildInfantryCostFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare wildInfantryDefenseFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare wildShipsDefenseFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare wildLandingDefenseFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare baseInfantryCost: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare baseShipCost: number;

    @column()
    declare spyTerritoryCost: number;

    @column()
    declare spyFortifiedTerritoryCost: number;

    @column()
    declare spyFactoryCost: number;

    @column()
    declare spyPlayerCost: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare financePlayerCostFactor: number;

    @column()
    declare financePlayerStep: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare financeWildTerritoryCostFactor: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare financeWildTerritoryEnforcementFactor: number;

    @column()
    declare financeWildTerritoryStep: number;

    @column({
        consume: (value: string | number): string => {
            return Number(value).toString();
        },
    })
    declare wildTerritorySubvertFactor: number;

    @column()
    declare subvertCost: number;

    @column()
    declare fortifyCost: number;

    @column()
    declare peaceSeasonsInterval: number;

    @column()
    declare neutralFlagId: string;

    @belongsTo((): typeof File => File, {
        foreignKey: 'neutralFlagId',
    })
    declare neutralFlag: BelongsTo<typeof File>;

    @column()
    declare fortifiedIconId: string;

    @belongsTo((): typeof File => File, {
        foreignKey: 'fortifiedIconId',
    })
    declare fortifiedIcon: BelongsTo<typeof File>;

    @column()
    declare factoryIconId: string;

    @belongsTo((): typeof File => File, {
        foreignKey: 'factoryIconId',
    })
    declare factoryIcon: BelongsTo<typeof File>;

    @column()
    declare createdById: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'createdById',
    })
    declare createdBy: BelongsTo<typeof User>;

    @hasMany((): typeof Territory => Territory)
    declare territories: HasMany<typeof Territory>;

    @hasMany((): typeof PlayableCountry => PlayableCountry)
    declare playableCountries: HasMany<typeof PlayableCountry>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public getFormatedPeaceSeasonsInterval(): { years: number; seasons: number } {
        return { years: Math.floor(this.peaceSeasonsInterval / 4), seasons: this.peaceSeasonsInterval % 4 };
    }

    public async apiSerialize(language: Language): Promise<SerializedMap> {
        return {
            id: this.frontId,
            name: this.name.get(language.code) ?? this.name.get('en') ?? '',
            mainSeason: this.mainSeason,
            baseInfantryCost: this.baseInfantryCost,
            baseShipCost: this.baseShipCost,
            spyTerritoryCost: this.spyTerritoryCost,
            spyFortifiedTerritoryCost: this.spyFortifiedTerritoryCost,
            spyFactoryCost: this.spyFactoryCost,
            spyPlayerCost: this.spyPlayerCost,
            financePlayerCostFactor: this.financePlayerCostFactor,
            financePlayerStep: this.financePlayerStep,
            financeWildTerritoryStep: this.financeWildTerritoryStep,
            subvertCost: this.subvertCost,
            fortifyCost: this.fortifyCost,
            territories: await Promise.all(this.territories.map(async (territory: Territory): Promise<SerializedTerritory> => territory.apiSerialize(language, true))),
            createdBy: this.createdBy.apiSerialize(),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }

    public apiSerializeLight(language: Language): SerializedMapLight {
        return {
            id: this.frontId,
            name: this.name.get(language.code) ?? this.name.get('en') ?? '',
            mainSeason: this.mainSeason,
            baseInfantryCost: this.baseInfantryCost,
            baseShipCost: this.baseShipCost,
            spyTerritoryCost: this.spyTerritoryCost,
            spyFortifiedTerritoryCost: this.spyFortifiedTerritoryCost,
            spyFactoryCost: this.spyFactoryCost,
            spyPlayerCost: this.spyPlayerCost,
            financePlayerCostFactor: this.financePlayerCostFactor,
            financePlayerStep: this.financePlayerStep,
            financeWildTerritoryStep: this.financeWildTerritoryStep,
            subvertCost: this.subvertCost,
            fortifyCost: this.fortifyCost,
            createdBy: this.createdBy.apiSerialize(),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
