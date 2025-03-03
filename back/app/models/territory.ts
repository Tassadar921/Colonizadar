import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import SerializedTerritory from '#types/serialized/serialized_territory';

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
